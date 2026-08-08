import type { SocialProvider } from '../../auth/AuthProvider'

type SocialAuthButtonsProps = {
  onSelect: (provider: SocialProvider) => void
  disabled?: boolean
  labels: Record<SocialProvider, string>
}

const providers: SocialProvider[] = ['google', 'github', 'microsoft', 'apple']

export function SocialAuthButtons({
  onSelect,
  disabled = false,
  labels,
}: SocialAuthButtonsProps) {
  return (
    <div className="social-auth">
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          className={`social-auth-button social-auth-button--${provider}`}
          disabled={disabled}
          onClick={() => onSelect(provider)}
        >
          <ProviderIcon provider={provider} />
          <span>{labels[provider]}</span>
        </button>
      ))}
    </div>
  )
}

function ProviderIcon({ provider }: { provider: SocialProvider }) {
  switch (provider) {
    case 'google':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z"
          />
          <path
            fill="#34A853"
            d="M6.6 14.3l-.8.6-2.5 1.9C5 19.2 8.2 21 12 21c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 1-3.6 1-2.8 0-5.1-1.9-5.9-4.4z"
          />
          <path
            fill="#4A90E2"
            d="M3.3 7.2C2.5 8.7 2 10.3 2 12s.5 3.3 1.3 4.8l3.3-2.5C6.2 13.4 6 12.7 6 12s.2-1.4.5-2.1L3.3 7.2z"
          />
          <path
            fill="#FBBC05"
            d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.9 14.7 2 12 2 8.2 2 5 3.8 3.3 7.2l3.2 2.5C7 7.9 9.2 6 12 6z"
          />
        </svg>
      )
    case 'github':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5 0c2-.1 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2z"
          />
        </svg>
      )
    case 'microsoft':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
          <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
          <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
          <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
        </svg>
      )
    case 'apple':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.4 12.8c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1-.1 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.7zM14.3 6.4c.6-.7 1-1.7.9-2.7-0.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 1.9-.5 2.6-1.2z"
          />
        </svg>
      )
  }
}
