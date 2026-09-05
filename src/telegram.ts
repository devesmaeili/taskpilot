export function getTelegramBotUsername(): string {
  return (import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? '').replace(/^@/, '').trim()
}

export function isTelegramConfigured(): boolean {
  return Boolean(getTelegramBotUsername())
}

export function getTelegramConnectUrl(startPayload?: string): string | null {
  const username = getTelegramBotUsername()
  if (!username) return null

  const base = `https://t.me/${username}`
  if (!startPayload) return base
  return `${base}?start=${encodeURIComponent(startPayload)}`
}
