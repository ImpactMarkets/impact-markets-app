export default function refreshSession() {
  const event = new Event('visibilitychange')
  document.dispatchEvent(event)
}
