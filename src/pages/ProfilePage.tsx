import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function ProfilePage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const displayName =
    user?.displayName || user?.email || t('appHome.anonymousUser')
  const email = user?.email ?? t('profile.noEmail')
  const photoURL = user?.photoURL

  return (
    <main className="profile-page">
      <p className="auth-kicker">{t('profile.kicker')}</p>
      <h1>{t('profile.title')}</h1>
      <p className="section-supporting">{t('profile.supporting')}</p>

      <section className="profile-card">
        {photoURL ? (
          <img
            className="profile-avatar-image"
            src={photoURL}
            alt=""
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="profile-avatar-fallback" aria-hidden="true">
            {getInitials(displayName)}
          </span>
        )}

        <dl className="profile-fields">
          <div>
            <dt>{t('profile.name')}</dt>
            <dd>{displayName}</dd>
          </div>
          <div>
            <dt>{t('profile.email')}</dt>
            <dd>{email}</dd>
          </div>
          <div>
            <dt>{t('profile.userId')}</dt>
            <dd className="profile-uid">{user?.uid ?? '—'}</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
