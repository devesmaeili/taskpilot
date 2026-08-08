import { useTranslation } from 'react-i18next'
import { useTheme, type Theme } from '../theme/ThemeProvider'

const themes: Theme[] = ['system', 'light', 'dark']

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

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
