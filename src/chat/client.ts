import type { AiModel } from './models'
import { findModel } from './models'

export type ChatRole = 'user' | 'model'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

const SYSTEM_INSTRUCTION =
  'You are TaskPilot, a helpful AI assistant for productivity, learning, and automation. Be concise, clear, and practical.'

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>
    }
  }>
  error?: {
    message?: string
  }
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(import.meta.env.VITE_OPENROUTER_API_KEY)
}

export function isChatConfigured(): boolean {
  return isOpenRouterConfigured()
}

export function canUseModel(_model: AiModel): boolean {
  return isOpenRouterConfigured()
}

function openRouterContent(
  content: string | Array<{ type?: string; text?: string }> | undefined,
) {
  if (typeof content === 'string') return content.trim()
  if (!Array.isArray(content)) return ''
  return content
    .map((part) => part.text ?? '')
    .join('')
    .trim()
}

async function generateOpenRouterReply(
  modelId: string,
  history: ChatMessage[],
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OpenRouter is not configured')
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'TaskPilot',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...history.map((message) => ({
          role: message.role === 'model' ? 'assistant' : 'user',
          content: message.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  const data = (await response.json()) as OpenRouterResponse

  if (!response.ok) {
    throw new Error(
      data.error?.message || `OpenRouter request failed (${response.status})`,
    )
  }

  const text = openRouterContent(data.choices?.[0]?.message?.content)
  if (!text) {
    throw new Error('Model returned an empty response')
  }

  return text
}

export async function generateChatReply(
  modelId: string,
  history: ChatMessage[],
  freeModels: AiModel[] = [],
): Promise<string> {
  const model = findModel(modelId, freeModels)
  if (!model) {
    throw new Error('Unknown model selected')
  }

  if (!canUseModel(model)) {
    throw new Error('Add VITE_OPENROUTER_API_KEY to use this model')
  }

  return generateOpenRouterReply(model.id, history)
}
