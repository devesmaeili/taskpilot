import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SettingsMenu } from '../components/SettingsMenu'
import { UserMenu } from '../components/UserMenu'

export function AppShell() {
  const { t } = useTranslation()

  return (
    <div className="app-shell">
      <header className="app-shell-header">
        <div className="app-shell-header-inner">
          <NavLink className="site-logo" to="/">
            {t('app.name')}
          </NavLink>

          <nav className="app-shell-nav" aria-label={t('appNav.label')}>
            <NavLink
              to="/app/chat"
              className={({ isActive }) =>
                isActive ? 'app-shell-nav-link is-active' : 'app-shell-nav-link'
              }
            >
              {t('appNav.chat')}
            </NavLink>
            <NavLink
              to="/app/automations"
              className={({ isActive }) =>
                isActive ? 'app-shell-nav-link is-active' : 'app-shell-nav-link'
              }
            >
              {t('appNav.automations')}
            </NavLink>
          </nav>

          <div className="site-actions">
            <SettingsMenu />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="app-shell-body">
        <Outlet />
      </div>
    </div>
  )
}
