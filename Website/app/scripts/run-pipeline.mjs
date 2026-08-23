// Runs the data pipeline with an interpreter that can actually import openpyxl.
//
// Bare `python3` is not safe to assume: this machine has five of them on PATH
// and only one (Anaconda's) has openpyxl installed. An interactive shell picks
// that one, but a process launched by an editor, a task runner or the Vite dev
// server often inherits a different PATH and picks a bare system Python — which
// fails with "openpyxl not installed" even though the pipeline works fine when
// run by hand. So resolve the interpreter by capability, not by name.
//
// Used by the npm data scripts and by the dev-server watcher in vite.config.js
// so both agree on which Python to use.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
export const APP_ROOT = path.dirname(HERE)

const canImportOpenpyxl = (exe) => {
  const r = spawnSync(exe, ['-c', 'import openpyxl'], { stdio: 'ignore' })
  return !r.error && r.status === 0
}

let cached = null

/** First interpreter that can import openpyxl. Throws with guidance if none. */
export function resolvePython() {
  if (cached) return cached

  const home = os.homedir()
  const candidates = [
    process.env.WFF_PYTHON,          // explicit override always wins
    'python3',
    'python',
    path.join(home, 'anaconda3/bin/python3'),
    path.join(home, 'miniconda3/bin/python3'),
    path.join(home, 'micromamba/bin/python3'),
    '/opt/homebrew/bin/python3',
    '/usr/local/bin/python3',
    '/usr/bin/python3',
  ].filter(Boolean)

  const tried = []
  for (const exe of candidates) {
    // Skip absolute paths that do not exist, so the error list stays honest.
    if (path.isAbsolute(exe) && !fs.existsSync(exe)) continue
    tried.push(exe)
    if (canImportOpenpyxl(exe)) {
      cached = exe
      return exe
    }
  }

  throw new Error(
    'No Python interpreter with openpyxl was found.\n' +
    `Tried: ${tried.join(', ')}\n` +
    'Install it (e.g. `python3 -m pip install openpyxl`), or point WFF_PYTHON at\n' +
    'the interpreter that has it, e.g. WFF_PYTHON=~/anaconda3/bin/python3'
  )
}

/** Run build_data.py. Returns {ok, stdout, stderr}; never throws on script error. */
export function runPipeline(args = [], { inherit = false } = {}) {
  const python = resolvePython()
  const r = spawnSync(python, ['scripts/build_data.py', ...args], {
    cwd: APP_ROOT,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
  })
  return {
    ok: !r.error && r.status === 0,
    python,
    stdout: r.stdout || '',
    stderr: r.stderr || (r.error ? r.error.message : ''),
  }
}

// Invoked directly by the npm scripts: stream output, exit with the real code.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  let python
  try {
    python = resolvePython()
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
  console.log(`using ${python}`)
  const r = spawnSync(python, ['scripts/build_data.py', ...process.argv.slice(2)], {
    cwd: APP_ROOT,
    stdio: 'inherit',
  })
  process.exit(r.status === null ? 1 : r.status)
}
