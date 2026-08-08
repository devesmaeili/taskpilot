import { useTranslation } from 'react-i18next'

export function HeroMock() {
  const { t } = useTranslation()
  const steps = t('how.steps', { returnObjects: true }) as Array<{
    title: string
  }>

  return (
    <div className="hero-mock" aria-hidden="true">
      <div className="hero-mock-card hero-mock-workflow">
        <p className="hero-mock-kicker">{t('hero.mock.workflow')}</p>
        <ol className="hero-mock-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={index === 0 ? 'is-active' : undefined} />
              {step.title}
            </li>
          ))}
        </ol>
      </div>

      <div className="hero-mock-card hero-mock-automation">
        <div className="hero-mock-header">
          <p className="hero-mock-title">{t('hero.mock.automationTitle')}</p>
          <p className="hero-mock-meta">{t('hero.mock.automationMeta')}</p>
        </div>
        <ul className="hero-mock-chips">
          <li>{t('hero.mock.chipLevel')}</li>
          <li>{t('hero.mock.chipFocus')}</li>
          <li>{t('hero.mock.chipMemory')}</li>
        </ul>
        <div className="hero-mock-status">
          <span className="hero-mock-status-dot" />
          {t('hero.mock.running')}
        </div>
      </div>
    </div>
  )
}
