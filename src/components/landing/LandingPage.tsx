import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthProvider'
import { SettingsMenu } from '../SettingsMenu'
import { HeroMock } from './HeroMock'
import { HeroVisual } from './HeroVisual'

type Step = {
  title: string
  description: string
}

type Category = {
  title: string
  description: string
}

export function LandingPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const steps = t('how.steps', { returnObjects: true }) as Step[]
  const examples = t('problem.examples', { returnObjects: true }) as string[]
  const categories = t('categories.items', { returnObjects: true }) as Category[]

  return (
    <div className="landing">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="site-logo" href="#top">
            {t('app.name')}
          </a>

          <nav className="site-nav" aria-label="Primary">
            <a href="#how">{t('nav.how')}</a>
            <a href="#products">{t('nav.automations')}</a>
            <a href="#products">{t('nav.chat')}</a>
          </nav>

          <div className="site-actions">
            <SettingsMenu />
            {user ? (
              <Link className="button button-primary" to="/app">
                {t('nav.openApp')}
              </Link>
            ) : (
              <>
                <Link className="button button-ghost" to="/signin">
                  {t('nav.signIn')}
                </Link>
                <Link className="button button-primary" to="/signup">
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <HeroVisual />
          <div className="hero-layout">
            <div className="hero-content">
              <p className="hero-brand">{t('app.name')}</p>
              <h1>{t('hero.headline')}</h1>
              <p className="hero-supporting">{t('hero.supporting')}</p>
              <div className="hero-actions">
                <Link className="button button-primary button-lg" to={user ? '/app' : '/signup'}>
                  {t('hero.primaryCta')}
                </Link>
                <a className="button button-ghost button-lg" href="#how">
                  {t('hero.secondaryCta')}
                </a>
              </div>
            </div>
            <HeroMock />
          </div>
        </section>

        <section className="section problem" id="problem">
          <div className="section-inner">
            <h2>{t('problem.title')}</h2>
            <p className="section-supporting">{t('problem.supporting')}</p>
            <div className="example-list">
              <p className="example-label">{t('problem.examplesTitle')}</p>
              <ul>
                {examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section how" id="how">
          <div className="section-inner">
            <h2>{t('how.title')}</h2>
            <p className="section-supporting">{t('how.supporting')}</p>
            <ol className="steps">
              {steps.map((step, index) => (
                <li key={step.title} style={{ '--step-index': index } as CSSProperties}>
                  <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section products" id="products">
          <div className="section-inner">
            <h2>{t('products.title')}</h2>
            <p className="section-supporting">{t('products.supporting')}</p>
            <div className="product-split">
              <article>
                <h3>{t('products.automations.title')}</h3>
                <p>{t('products.automations.description')}</p>
              </article>
              <article>
                <h3>{t('products.chat.title')}</h3>
                <p>{t('products.chat.description')}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section categories" id="categories">
          <div className="section-inner">
            <h2>{t('categories.title')}</h2>
            <p className="section-supporting">{t('categories.supporting')}</p>
            <div className="category-list">
              {categories.map((category) => (
                <article key={category.title}>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </article>
              ))}
            </div>
            <p className="coming-note">{t('categories.coming')}</p>
          </div>
        </section>

        <section className="section memory" id="memory">
          <div className="section-inner memory-inner">
            <h2>{t('memory.title')}</h2>
            <p className="section-supporting">{t('memory.supporting')}</p>
          </div>
        </section>

        <section className="section final-cta" id="cta">
          <div className="section-inner">
            <h2>{t('cta.title')}</h2>
            <p className="section-supporting">{t('cta.supporting')}</p>
            <Link className="button button-primary button-lg" to={user ? '/app' : '/signup'}>
              {t('cta.button')}
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-inner footer-inner">
          <p className="footer-brand">{t('app.name')}</p>
          <p>{t('footer.rights')}</p>
          <div className="footer-controls">
            <SettingsMenu />
          </div>
        </div>
      </footer>
    </div>
  )
}
