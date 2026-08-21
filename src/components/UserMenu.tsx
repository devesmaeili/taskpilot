import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function UserMenu() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const displayName =
    user?.displayName || user?.email || t('appHome.anonymousUser')
  const email = user?.email ?? ''
  const photoURL = user?.photoURL

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-label={t('userMenu.label')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        {photoURL ? (
          <img
            className="user-avatar-image"
            src={photoURL}
            alt=""
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="user-avatar-fallback" aria-hidden="true">
            {getInitials(displayName)}
          </span>
        )}
      </button>

      {open ? (
        <div className="user-menu-panel" id={menuId} role="menu">
          <div className="user-menu-summary">
            <p className="user-menu-name">{displayName}</p>
            {email ? <p className="user-menu-email">{email}</p> : null}
          </div>

          <Link
            role="menuitem"
            className="user-menu-item"
            to="/app/profile"
            onClick={() => setOpen(false)}
          >
            {t('userMenu.profile')}
          </Link>

          <button
            type="button"
            role="menuitem"
            className="user-menu-item user-menu-item-danger"
            onClick={() => {
              setOpen(false)
              void signOut()
            }}
          >
            {t('userMenu.signOut')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
