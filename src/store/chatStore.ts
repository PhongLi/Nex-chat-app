import { create } from 'zustand'
import { User } from '../types'

interface ChatStore {
  chatId: string | null
  user: User | null
  changeChat: (chatId: string, user: User) => void
  resetChat: () => void
}

export const useChatStore = create<ChatStore>(set => ({
  chatId: null,
  user: null,
  changeChat: (chatId, user) => {
    set({
      chatId,
      user,
    })
  },

  resetChat: () => {
    set({
      chatId: null,
      user: null,
    })
  },
}))
