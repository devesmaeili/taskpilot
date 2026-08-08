import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FirebaseError } from 'firebase/app'
import { useAuth, type SocialProvider } from '../../auth/AuthProvider'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { SocialAuthButtons } from './SocialAuthButtons'

type AuthMode = 'signin' | 'signup'

type AuthPageProps = {
  mode: AuthMode
}

export function AuthPage({ mode }: AuthPageProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, configured, signInWithEmail, signUpWithEmail, signInWithSocial } =
    useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/app'

  if (!loading && user) {
    return <Navigate to={redirectTo} replace />
  }

  const socialLabels: Record<SocialProvider, string> = {
    google: t('auth.providers.google'),
    github: t('auth.providers.github'),
    microsoft: t('auth.providers.microsoft'),
    apple: t('auth.providers.apple'),
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName)
      } else {
        await signInWithEmail(email, password)
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(mapAuthError(err, t))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSocial(provider: SocialProvider) {
    setError(null)
    setSubmitting(true)

    try {
      await signInWithSocial(provider)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(mapAuthError(err, t))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <Link className="site-logo" to="/">
          {t('app.name')}
        </Link>
        <div className="site-actions">
          <ThemeSwitcher compact />
          <LanguageSwitcher compact />
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-card">
          <p className="auth-kicker">{t('app.name')}</p>
          <h1>{mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle')}</h1>
          <p className="auth-supporting">
            {mode === 'signin' ? t('auth.signInSupporting') : t('auth.signUpSupporting')}
          </p>

          {!configured && (
            <p className="auth-banner" role="status">
              {t('auth.notConfigured')}
            </p>
          )}

          <SocialAuthButtons
            labels={socialLabels}
            disabled={!configured || submitting}
            onSelect={handleSocial}
          />

          <div className="auth-divider">
            <span>{t('auth.orEmail')}</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="auth-field">
                <span>{t('auth.displayName')}</span>
                <input
                  type="text"
                  name="displayName"
                  autoComplete="name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  disabled={!configured || submitting}
                />
              </label>
            )}

            <label className="auth-field">
              <span>{t('auth.email')}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!configured || submitting}
              />
            </label>

            <label className="auth-field">
              <span>{t('auth.password')}</span>
              <input
                type="password"
                name="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={!configured || submitting}
              />
            </label>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button button-primary button-lg auth-submit"
              disabled={!configured || submitting}
            >
              {submitting
                ? t('auth.working')
                : mode === 'signin'
                  ? t('auth.signInCta')
                  : t('auth.signUpCta')}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'signin' ? (
              <>
                {t('auth.noAccount')}{' '}
                <Link to="/signup">{t('auth.goSignUp')}</Link>
              </>
            ) : (
              <>
                {t('auth.hasAccount')}{' '}
                <Link to="/signin">{t('auth.goSignIn')}</Link>
              </>
            )}
          </p>
        </section>
      </main>
    </div>
  )
}

function mapAuthError(
  error: unknown,
  t: (key: string) => string,
): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return t('auth.errors.emailInUse')
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return t('auth.errors.invalidCredentials')
      case 'auth/weak-password':
        return t('auth.errors.weakPassword')
      case 'auth/popup-closed-by-user':
        return t('auth.errors.popupClosed')
      case 'auth/account-exists-with-different-credential':
        return t('auth.errors.accountExists')
      case 'auth/unauthorized-domain':
        return t('auth.errors.unauthorizedDomain')
      case 'auth/operation-not-allowed':
        return t('auth.errors.providerDisabled')
      default:
        return t('auth.errors.generic')
    }
  }

  if (error instanceof Error && error.message.includes('Firebase is not configured')) {
    return t('auth.notConfigured')
  }

  return t('auth.errors.generic')
}
