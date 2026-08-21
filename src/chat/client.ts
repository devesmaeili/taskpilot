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

type GeminiContent = {
  role: ChatRole
  parts: Array<{ text: string }>
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
  error?: {
    message?: string
  }
}

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

export function isGeminiConfigured(): boolean {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY)
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(import.meta.env.VITE_OPENROUTER_API_KEY)
}

export function isChatConfigured(): boolean {
  return isGeminiConfigured() || isOpenRouterConfigured()
}

export function canUseModel(model: AiModel): boolean {
  if (model.transport === 'gemini') return isGeminiConfigured()
  return isOpenRouterConfigured()
}

function geminiModelName(modelId: string) {
  return modelId.replace(/^gemini-direct\//, '')
}

async function generateGeminiReply(
  modelId: string,
  history: ChatMessage[],
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini is not configured')
  }

  const contents: GeminiContent[] = history.map((message) => ({
    role: message.role,
    parts: [{ text: message.content }],
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelName(modelId)}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    },
  )

  const data = (await response.json()) as GeminiResponse

  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini request failed (${response.status})`)
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim()

  if (!text) {
    throw new Error('Gemini returned an empty response')
  }

  return text
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
    if (model.transport === 'gemini') {
      throw new Error('Add VITE_GEMINI_API_KEY to use Gemini models')
    }
    throw new Error('Add VITE_OPENROUTER_API_KEY to use this model')
  }

  if (model.transport === 'gemini') {
    return generateGeminiReply(model.id, history)
  }

  return generateOpenRouterReply(model.id, history)
}
