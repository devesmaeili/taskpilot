import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'
import { SettingsMenu } from '../components/SettingsMenu'

export function AppHomePage() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()

  const displayName =
    user?.displayName || user?.email || t('appHome.anonymousUser')

  return (
    <div className="app-home">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-logo" to="/">
            {t('app.name')}
          </Link>
          <div className="site-actions">
            <SettingsMenu />
            <button type="button" className="button button-ghost" onClick={() => void signOut()}>
              {t('appHome.signOut')}
            </button>
          </div>
        </div>
      </header>

      <main className="section-inner app-home-main">
        <p className="auth-kicker">{t('appHome.kicker')}</p>
        <h1>{t('appHome.title', { name: displayName })}</h1>
        <p className="section-supporting">{t('appHome.supporting')}</p>
      </main>
    </div>
  )
}
