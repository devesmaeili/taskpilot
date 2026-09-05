import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthProvider'
import {
  getTelegramConnectUrl,
  isTelegramConfigured,
} from '../../telegram'
import { SettingsMenu } from '../SettingsMenu'
import { UserMenu } from '../UserMenu'
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
  const telegramConfigured = isTelegramConfigured()
  const telegramUrl = getTelegramConnectUrl(user?.uid ? `link_${user.uid}` : undefined)

  return (
    <div className="landing">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-logo" to="/">
            {t('app.name')}
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <a href="#how">{t('nav.how')}</a>
            <a href="#products">{t('nav.automations')}</a>
            <a href="#telegram">{t('nav.telegram')}</a>
            <a href="#products">{t('nav.chat')}</a>
          </nav>

          <div className="site-actions">
            <SettingsMenu />
            {user ? (
              <>
                <Link className="button button-primary" to="/app">
                  {t('nav.openApp')}
                </Link>
                <UserMenu />
              </>
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

        <section className="section telegram" id="telegram">
          <div className="section-inner telegram-inner">
            <p className="telegram-kicker">{t('telegram.kicker')}</p>
            <h2>{t('telegram.title')}</h2>
            <p className="section-supporting">{t('telegram.supporting')}</p>
            {telegramConfigured && telegramUrl ? (
              <a
                className="button button-primary button-lg telegram-connect"
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <TelegramIcon />
                {t('telegram.connect')}
              </a>
            ) : (
              <p className="auth-banner telegram-banner">{t('telegram.notConfigured')}</p>
            )}
            <p className="telegram-note">{t('telegram.note')}</p>
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

function TelegramIcon() {
  return (
    <svg className="telegram-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.788.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      />
    </svg>
  )
}
