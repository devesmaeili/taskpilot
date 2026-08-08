import { useTranslation } from 'react-i18next'
import { supportedLanguages, type LanguageCode } from '../i18n'

type LanguageSwitcherProps = {
  compact?: boolean
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const activeLanguage = (i18n.resolvedLanguage ?? i18n.language).split(
    '-',
  )[0] as LanguageCode

  if (compact) {
    return (
      <label className="nav-select">
        <span className="visually-hidden">{t('language.label')}</span>
        <select
          value={activeLanguage}
          aria-label={t('language.label')}
          onChange={(event) => void i18n.changeLanguage(event.target.value)}
        >
          {supportedLanguages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <fieldset className="preference-group">
      <legend>{t('language.label')}</legend>
      <div
        className="segmented-control"
        role="group"
        aria-label={t('language.label')}
      >
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            type="button"
            className={activeLanguage === language.code ? 'is-active' : undefined}
            aria-pressed={activeLanguage === language.code}
            onClick={() => void i18n.changeLanguage(language.code)}
          >
            {language.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
