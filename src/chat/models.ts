export type ModelGroup = 'chatgpt' | 'gemini' | 'claude' | 'free'

export type AiModel = {
  id: string
  name: string
  group: ModelGroup
  description?: string
  free: boolean
}

export const MODEL_GROUPS: Array<{ id: ModelGroup; labelKey: string }> = [
  { id: 'chatgpt', labelKey: 'chat.models.groups.chatgpt' },
  { id: 'gemini', labelKey: 'chat.models.groups.gemini' },
  { id: 'claude', labelKey: 'chat.models.groups.claude' },
  { id: 'free', labelKey: 'chat.models.groups.free' },
]

/** Curated popular models (Final catalog for paid/named providers). */
export const CURATED_MODELS: AiModel[] = [
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o mini',
    group: 'chatgpt',
    description: 'Fast ChatGPT for everyday tasks',
    free: false,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    group: 'chatgpt',
    description: 'Strong all-round ChatGPT model',
    free: false,
  },
  {
    id: 'openai/gpt-4.1',
    name: 'GPT-4.1',
    group: 'chatgpt',
    description: 'Latest OpenAI flagship via OpenRouter',
    free: false,
  },
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    group: 'gemini',
    description: 'Fast Gemini via OpenRouter',
    free: false,
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    group: 'gemini',
    description: 'Higher-quality Gemini via OpenRouter',
    free: false,
  },
  {
    id: 'google/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    group: 'gemini',
    description: 'Previous Gemini Flash via OpenRouter',
    free: false,
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    group: 'claude',
    description: 'Fast Claude for quick answers',
    free: false,
  },
  {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    group: 'claude',
    description: 'Balanced Claude model',
    free: false,
  },
  {
    id: 'anthropic/claude-opus-4',
    name: 'Claude Opus 4',
    group: 'claude',
    description: 'Most capable Claude model',
    free: false,
  },
]

/** Fallback free models if OpenRouter catalog cannot be loaded. */
export const FALLBACK_FREE_MODELS: AiModel[] = [
  {
    id: 'google/gemma-3-27b-it:free',
    name: 'Gemma 3 27B',
    group: 'free',
    free: true,
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    group: 'free',
    free: true,
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    group: 'free',
    free: true,
  },
  {
    id: 'mistralai/mistral-small-3.1-24b-instruct:free',
    name: 'Mistral Small 3.1',
    group: 'free',
    free: true,
  },
  {
    id: 'qwen/qwen3-32b:free',
    name: 'Qwen3 32B',
    group: 'free',
    free: true,
  },
  {
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
    name: 'Nemotron Ultra',
    group: 'free',
    free: true,
  },
]

export const DEFAULT_MODEL_ID = 'google/gemini-2.5-flash'

const SELECTED_MODEL_KEY = 'taskpilot-selected-model'

/** Older local selections before OpenRouter-only. */
const LEGACY_MODEL_IDS: Record<string, string> = {
  'gemini-direct/gemini-3.6-flash': DEFAULT_MODEL_ID,
}

type OpenRouterModel = {
  id: string
  name?: string
  description?: string
  pricing?: {
    prompt?: string
    completion?: string
  }
}

function isZeroPrice(value?: string) {
  if (value == null || value === '') return true
  const amount = Number(value)
  return Number.isFinite(amount) && amount === 0
}

export function isModelFree(model: OpenRouterModel) {
  return (
    model.id.endsWith(':free') ||
    (isZeroPrice(model.pricing?.prompt) && isZeroPrice(model.pricing?.completion))
  )
}

export async function fetchFreeOpenRouterModels(): Promise<AiModel[]> {
  const response = await fetch('https://openrouter.ai/api/v1/models')
  if (!response.ok) {
    throw new Error(`Failed to load free models (${response.status})`)
  }

  const data = (await response.json()) as { data?: OpenRouterModel[] }
  const models = (data.data ?? [])
    .filter(isModelFree)
    .map(
      (model): AiModel => ({
        id: model.id,
        name: model.name?.replace(/\s*\(free\)/i, '').trim() || model.id,
        group: 'free',
        description: model.description,
        free: true,
      }),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  return models.length > 0 ? models : FALLBACK_FREE_MODELS
}

export function resolveModelId(modelId: string): string {
  return LEGACY_MODEL_IDS[modelId] ?? modelId
}

export function findModel(
  modelId: string,
  freeModels: AiModel[] = FALLBACK_FREE_MODELS,
): AiModel | undefined {
  const resolvedId = resolveModelId(modelId)
  return (
    CURATED_MODELS.find((model) => model.id === resolvedId) ??
    freeModels.find((model) => model.id === resolvedId) ??
    FALLBACK_FREE_MODELS.find((model) => model.id === resolvedId)
  )
}

export function loadSelectedModelId(): string {
  try {
    const stored = localStorage.getItem(SELECTED_MODEL_KEY) || DEFAULT_MODEL_ID
    return resolveModelId(stored)
  } catch {
    return DEFAULT_MODEL_ID
  }
}

export function saveSelectedModelId(modelId: string) {
  localStorage.setItem(SELECTED_MODEL_KEY, resolveModelId(modelId))
}

export function modelsForGroup(
  group: ModelGroup,
  freeModels: AiModel[],
): AiModel[] {
  if (group === 'free') return freeModels
  return CURATED_MODELS.filter((model) => model.group === group)
}
