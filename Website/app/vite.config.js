import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { resolvePython, runPipeline } from './scripts/run-pipeline.mjs'

// The chart data the site renders lives in src/data/*-figures.json, which is
// GENERATED from scripts/topic_figures.py (+ Final Data.xlsx) by build_data.py.
// Editing the Python alone changes nothing on screen until that runs, which is
// a silent-staleness trap: the source says one thing, the page shows another.
// This plugin closes the loop — save the Python, the data rebuilds and the page
// reloads. `--figures-only` skips the ~12 MB Level-3 timeseries (untouched by a
// chart-copy edit) and the parse cache makes the rebuild well under a second.
function rebuildDataOnPythonChange() {
  let running = false
  let queued = false

  const rebuild = (server, file) => {
    if (running) { queued = true; return }
    running = true
    const rel = path.relative(server.config.root, file)
    server.config.logger.info(`\n  ${rel} changed — rebuilding chart data…`)

    // Synchronous: the pipeline is sub-second on a warm parse cache, and it
    // keeps the reload strictly ordered after the files are written.
    const { ok, stdout, stderr } = runPipeline(['--figures-only'])
    running = false

    if (ok) {
      const wrote = stdout.split('\n').filter((l) => l.includes('-figures.json')).length
      server.config.logger.info(`  chart data rebuilt (${wrote} topic files) — reloading`)
      server.ws.send({ type: 'full-reload' })
    } else {
      // Surface it in the terminal AND as the browser error overlay, so a
      // broken edit can never look like "nothing happened".
      const msg = (stderr || stdout).trim()
      server.config.logger.error(`  chart data rebuild FAILED:\n${msg}`)
      server.ws.send({
        type: 'error',
        err: { message: `build_data.py failed\n\n${msg}`, stack: '' },
      })
    }

    if (queued) { queued = false; rebuild(server, file) }
  }

  return {
    name: 'wff-rebuild-data-on-python-change',
    apply: 'serve',
    configureServer(server) {
      // Fail loudly at startup rather than on the first save, so a missing
      // openpyxl is a message you get before you've written an edit.
      try {
        server.config.logger.info(`  data pipeline will use ${resolvePython()}`)
      } catch (e) {
        server.config.logger.warn(
          `  chart-data auto-rebuild is DISABLED — ${e.message.split('\n')[0]}\n` +
          '  (the site still runs on the committed src/data/*.json)'
        )
        return
      }

      const watched = ['scripts/topic_figures.py', 'scripts/build_data.py']
        .map((f) => path.join(server.config.root, f))
      server.watcher.add(watched)
      server.watcher.on('change', (file) => {
        if (watched.includes(path.normalize(file))) rebuild(server, file)
      })
    },
  }
}

// Static-hostable SPA. `base: './'` makes the built /dist work from any
// sub-path (GitHub Pages, Netlify, or opening over a static server).
export default defineConfig({
  plugins: [react(), rebuildDataOnPythonChange()],
  base: './',
  server: { port: 5180, host: true, strictPort: false },
  preview: { port: 5181, host: true },
  build: { outDir: 'dist', assetsInlineLimit: 4096 },
})
