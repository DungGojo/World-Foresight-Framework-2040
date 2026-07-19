// JS mirror of tokens.css for D3 charts (build spec §14).
export const palette = {
  bg: '#f4efe6', panel: '#fbf8f1', ink: '#11191f', muted: '#656963',
  line: '#d7cfc0', navy: '#17314f',
  space: '#061016', glow: '#15334e',
  power: '#b43a31', tech: '#3f6f91', planet: '#647b45', people: '#ba8030', economy: '#6f6284',
};

export const font = {
  serif: '"Fraunces",Georgia,serif',
  sans: '"Inter",-apple-system,"Segoe UI",sans-serif',
};

// Fixed chart color legend (build spec §3.4) — learn it once per topic.
export const legend = {
  USA: palette.power,       // focus color
  CHN: palette.navy,
  IND: palette.people,
  rest: palette.muted,
  west: palette.power,
  cnrus: palette.navy,
  india: palette.people,
  global: palette.muted,
};

// Per-force accent + gradient fallback (build spec §12).
export const forceAccent = {
  power: '#9e2b25', tech: '#3b4e8c', planet: '#2e7d6b', people: '#b07a34', economy: '#4a5d73',
};
export function accentGradient(accent) {
  return `radial-gradient(circle at 30% 30%, ${accent}22, ${accent}05 60%, transparent), var(--bg)`;
}
export function darkAccentGradient(accent) {
  return `radial-gradient(120% 90% at 30% 20%, ${accent}55, ${accent}18 45%, #05070d 80%)`;
}
