// A random id per visit, so answers from one game can be grouped without knowing who played.
// crypto.randomUUID only exists on https or localhost; getRandomValues also works when
// testing on a phone over the local network (http://192.168…).
export function createSessionId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
