import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  canUseModel,
  isOpenRouterConfigured,
} from '../../chat/client'
import {
  CURATED_MODELS,
  FALLBACK_FREE_MODELS,
  MODEL_GROUPS,
  fetchFreeOpenRouterModels,
  findModel,
  modelsForGroup,
  type AiModel,
  type ModelGroup,
} from '../../chat/models'

type ModelPickerProps = {
  value: string
  onChange: (modelId: string) => void
  freeModels: AiModel[]
  freeModelsLoading: boolean
  freeModelsError: string | null
  disabled?: boolean
}

export function ModelPicker({
  value,
  onChange,
  freeModels,
  freeModelsLoading,
  freeModelsError,
  disabled = false,
}: ModelPickerProps) {
  const { t } = useTranslation()
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState<ModelGroup>(() => {
    return findModel(value, freeModels)?.group ?? 'gemini'
  })

  const selected = findModel(value, freeModels)
  const groupModels = useMemo(
    () => modelsForGroup(group, freeModels),
    [freeModels, group],
  )

  useEffect(() => {
    const matched = findModel(value, freeModels)
    if (matched) setGroup(matched.group)
  }, [value, freeModels])

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
    <div className="model-picker" ref={rootRef}>
      <button
        type="button"
        className="model-picker-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="model-picker-label">{t('chat.models.label')}</span>
        <span className="model-picker-value">
          {selected?.name ?? t('chat.models.unknown')}
          {selected?.free ? (
            <span className="model-picker-badge">{t('chat.models.freeBadge')}</span>
          ) : null}
        </span>
      </button>

      {open ? (
        <div className="model-picker-panel" id={panelId} role="dialog" aria-label={t('chat.models.label')}>
          <div className="model-picker-tabs" role="tablist" aria-label={t('chat.models.groupsLabel')}>
            {MODEL_GROUPS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={group === item.id}
                className={
                  group === item.id
                    ? 'model-picker-tab is-active'
                    : 'model-picker-tab'
                }
                onClick={() => setGroup(item.id)}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>

          {group === 'free' ? (
            <p className="model-picker-hint">
              {freeModelsLoading
                ? t('chat.models.loadingFree')
                : freeModelsError
                  ? freeModelsError
                  : t('chat.models.freeHint', { count: freeModels.length })}
            </p>
          ) : (
            <p className="model-picker-hint">{t(`chat.models.groupHints.${group}`)}</p>
          )}

          {!isOpenRouterConfigured() ? (
            <p className="model-picker-warning">{t('chat.models.needOpenRouter')}</p>
          ) : null}

          <ul className="model-picker-list">
            {groupModels.map((model) => {
              const available = canUseModel(model)
              const isSelected = model.id === value
              return (
                <li key={model.id}>
                  <button
                    type="button"
                    className={
                      isSelected
                        ? 'model-picker-option is-selected'
                        : 'model-picker-option'
                    }
                    disabled={!available}
                    onClick={() => {
                      onChange(model.id)
                      setOpen(false)
                    }}
                  >
                    <span className="model-picker-option-name">
                      {model.name}
                      {model.free ? (
                        <span className="model-picker-badge">
                          {t('chat.models.freeBadge')}
                        </span>
                      ) : null}
                    </span>
                    {model.description ? (
                      <span className="model-picker-option-desc">
                        {model.description}
                      </span>
                    ) : null}
                    {!available ? (
                      <span className="model-picker-option-desc">
                        {t('chat.models.needOpenRouter')}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export function useFreeModels() {
  const [freeModels, setFreeModels] = useState<AiModel[]>(FALLBACK_FREE_MODELS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const models = await fetchFreeOpenRouterModels()
        if (!cancelled) setFreeModels(models)
      } catch (caught) {
        if (!cancelled) {
          setFreeModels(FALLBACK_FREE_MODELS)
          setError(
            caught instanceof Error
              ? caught.message
              : 'Could not load free models',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { freeModels, loading, error, curated: CURATED_MODELS }
}
