import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthProvider'
import {
  generateChatReply,
  isChatConfigured,
  type ChatMessage,
} from '../chat/client'
import {
  createConversation,
  loadConversations,
  saveConversations,
  titleFromMessage,
  type Conversation,
} from '../chat/history'
import {
  DEFAULT_MODEL_ID,
  loadSelectedModelId,
  saveSelectedModelId,
} from '../chat/models'
import { ModelPicker, useFreeModels } from '../components/chat/ModelPicker'

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${crypto.randomUUID()}`,
    role,
    content,
  }
}

export function ChatPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const userId = user?.uid ?? 'anonymous'
  const configured = isChatConfigured()
  const inputId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const { freeModels, loading: freeModelsLoading, error: freeModelsError } =
    useFreeModels()

  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadConversations(userId),
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedModelId, setSelectedModelId] = useState(() => loadSelectedModelId())
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const skipSaveRef = useRef(true)

  useEffect(() => {
    const loaded = loadConversations(userId)
    skipSaveRef.current = true
    setConversations(loaded)
    setActiveId(loaded[0]?.id ?? null)
    if (loaded[0]?.modelId) {
      setSelectedModelId(loaded[0].modelId)
    }
  }, [userId])

  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }
    saveConversations(userId, conversations)
  }, [conversations, userId])

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? null,
    [activeId, conversations],
  )

  const messages = activeConversation?.messages ?? []

  useEffect(() => {
    if (activeConversation?.modelId) {
      setSelectedModelId(activeConversation.modelId)
    }
  }, [activeConversation?.id, activeConversation?.modelId])

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, sending, activeId])

  function handleModelChange(modelId: string) {
    setSelectedModelId(modelId)
    saveSelectedModelId(modelId)
    if (!activeId) return
    setConversations((current) =>
      current.map((item) =>
        item.id === activeId ? { ...item, modelId, updatedAt: Date.now() } : item,
      ),
    )
  }

  function startNewChat() {
    const conversation = createConversation(t('chat.newChat'), selectedModelId)
    setConversations((current) => [conversation, ...current])
    setActiveId(conversation.id)
    setError(null)
    setInput('')
    setSidebarOpen(false)
  }

  function selectConversation(id: string) {
    setActiveId(id)
    setError(null)
    setSidebarOpen(false)
  }

  function deleteConversation(id: string) {
    setConversations((current) => {
      const next = current.filter((item) => item.id !== id)
      if (activeId === id) {
        setActiveId(next[0]?.id ?? null)
      }
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending || !configured) return

    let conversationId = activeId
    let working = conversations
    const modelId = selectedModelId || DEFAULT_MODEL_ID

    if (!conversationId) {
      const conversation = createConversation(titleFromMessage(text), modelId)
      working = [conversation, ...conversations]
      conversationId = conversation.id
      setConversations(working)
      setActiveId(conversationId)
    }

    const userMessage = createMessage('user', text)
    const current = working.find((item) => item.id === conversationId)
    if (!current) return

    const withUser: Conversation = {
      ...current,
      modelId,
      title:
        current.messages.length === 0
          ? titleFromMessage(text)
          : current.title,
      updatedAt: Date.now(),
      messages: [...current.messages, userMessage],
    }

    const nextList = working.map((item) =>
      item.id === conversationId ? withUser : item,
    )
    setConversations(nextList)
    setInput('')
    setError(null)
    setSending(true)

    try {
      const reply = await generateChatReply(modelId, withUser.messages, freeModels)
      const withReply: Conversation = {
        ...withUser,
        updatedAt: Date.now(),
        messages: [...withUser.messages, createMessage('model', reply)],
      }
      setConversations((currentList) =>
        currentList.map((item) =>
          item.id === conversationId ? withReply : item,
        ),
      )
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : t('chat.errors.generic')
      setError(message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`chat-workspace${sidebarOpen ? ' is-sidebar-open' : ''}`}>
      <aside className="chat-sidebar" aria-label={t('chat.history')}>
        <div className="chat-sidebar-top">
          <h2>{t('chat.history')}</h2>
          <button
            type="button"
            className="button button-primary chat-new-button"
            onClick={startNewChat}
          >
            {t('chat.newChat')}
          </button>
        </div>

        <ul className="chat-history-list">
          {conversations.length === 0 ? (
            <li className="chat-history-empty">{t('chat.historyEmpty')}</li>
          ) : (
            conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  type="button"
                  className={
                    conversation.id === activeId
                      ? 'chat-history-item is-active'
                      : 'chat-history-item'
                  }
                  onClick={() => selectConversation(conversation.id)}
                >
                  <span className="chat-history-title">{conversation.title}</span>
                </button>
                <button
                  type="button"
                  className="chat-history-delete"
                  aria-label={t('chat.deleteChat')}
                  onClick={() => deleteConversation(conversation.id)}
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      <section className="chat-main" aria-labelledby="chat-title">
        <header className="chat-main-header">
          <button
            type="button"
            className="button button-ghost chat-sidebar-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {t('chat.history')}
          </button>
          <div className="chat-main-heading">
            <p className="auth-kicker">{t('chat.kicker')}</p>
            <h1 id="chat-title">{t('chat.title')}</h1>
          </div>
          <ModelPicker
            value={selectedModelId}
            onChange={handleModelChange}
            freeModels={freeModels}
            freeModelsLoading={freeModelsLoading}
            freeModelsError={freeModelsError}
            disabled={sending}
          />
        </header>

        {!configured ? (
          <p className="auth-banner chat-banner">{t('chat.notConfigured')}</p>
        ) : (
          <>
            <div
              className="chat-messages"
              ref={listRef}
              role="log"
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <p className="chat-empty">{t('chat.empty')}</p>
              ) : (
                messages.map((message) => (
                  <article
                    key={message.id}
                    className={`chat-bubble chat-bubble-${message.role}`}
                  >
                    <p className="chat-bubble-label">
                      {message.role === 'user'
                        ? t('chat.you')
                        : t('chat.assistant')}
                    </p>
                    <p className="chat-bubble-text">{message.content}</p>
                  </article>
                ))
              )}
              {sending ? (
                <article className="chat-bubble chat-bubble-model chat-bubble-pending">
                  <p className="chat-bubble-label">{t('chat.assistant')}</p>
                  <p className="chat-bubble-text">{t('chat.thinking')}</p>
                </article>
              ) : null}
            </div>

            {error ? <p className="auth-error chat-error">{error}</p> : null}

            <form
              className="chat-composer"
              onSubmit={(event) => void handleSubmit(event)}
            >
              <label className="visually-hidden" htmlFor={inputId}>
                {t('chat.placeholder')}
              </label>
              <textarea
                id={inputId}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t('chat.placeholder')}
                rows={2}
                disabled={sending}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
              />
              <button
                type="submit"
                className="button button-primary"
                disabled={sending || !input.trim()}
              >
                {sending ? t('chat.sending') : t('chat.send')}
              </button>
            </form>
          </>
        )}
      </section>

      {sidebarOpen ? (
        <button
          type="button"
          className="chat-sidebar-backdrop"
          aria-label={t('chat.closeHistory')}
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
    </div>
  )
}
