import type { ChatMessage } from './client'
import { DEFAULT_MODEL_ID } from './models'

export type Conversation = {
  id: string
  title: string
  updatedAt: number
  modelId: string
  messages: ChatMessage[]
}

const STORAGE_PREFIX = 'taskpilot-chat-history:'

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`
}

function normalizeConversation(value: Conversation): Conversation {
  return {
    ...value,
    modelId: value.modelId || DEFAULT_MODEL_ID,
    messages: Array.isArray(value.messages) ? value.messages : [],
  }
}

export function loadConversations(userId: string): Conversation[] {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as Conversation[]
    return Array.isArray(parsed) ? parsed.map(normalizeConversation) : []
  } catch {
    return []
  }
}

export function saveConversations(userId: string, conversations: Conversation[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(conversations))
}

export function createConversation(
  title = 'New chat',
  modelId = DEFAULT_MODEL_ID,
): Conversation {
  return {
    id: crypto.randomUUID(),
    title,
    updatedAt: Date.now(),
    modelId,
    messages: [],
  }
}

export function titleFromMessage(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, ' ')
  if (trimmed.length <= 42) return trimmed
  return `${trimmed.slice(0, 42)}…`
}
