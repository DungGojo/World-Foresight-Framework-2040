// Resolve a public/ asset path so it works in dev, in a built /dist, and under
// hash routing (the document path never changes, so BASE_URL stays correct).
export function asset(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path; // already absolute URL
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/$/, '/') + path.replace(/^\//, '');
}
