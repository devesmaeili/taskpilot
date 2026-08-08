import { useTranslation } from 'react-i18next'
import { useTheme, type Theme } from '../theme/ThemeProvider'

const themes: Theme[] = ['system', 'light', 'dark']

type ThemeSwitcherProps = {
  compact?: boolean
}

export function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  if (compact) {
    return (
      <label className="nav-select">
        <span className="visually-hidden">{t('theme.label')}</span>
        <select
          value={theme}
          aria-label={t('theme.label')}
          onChange={(event) => setTheme(event.target.value as Theme)}
        >
          {themes.map((option) => (
            <option key={option} value={option}>
              {t(`theme.${option}`)}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <fieldset className="preference-group">
      <legend>{t('theme.label')}</legend>
      <div className="segmented-control" role="group" aria-label={t('theme.label')}>
        {themes.map((option) => (
          <button
            key={option}
            type="button"
            className={theme === option ? 'is-active' : undefined}
            aria-pressed={theme === option}
            onClick={() => setTheme(option)}
          >
            {t(`theme.${option}`)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
