import { useTranslation } from 'react-i18next'

export function AutomationsPage() {
  const { t } = useTranslation()

  return (
    <main className="automations-page">
      <p className="auth-kicker">{t('automations.kicker')}</p>
      <h1>{t('automations.title')}</h1>
      <p className="section-supporting">{t('automations.supporting')}</p>
      <p className="auth-banner">{t('automations.comingSoon')}</p>
    </main>
  )
}
