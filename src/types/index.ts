export interface User {
  username: string
  email: string
  avatar: string
  id: string
}

export interface IChat {
  chatId: string
  receiverId: string
  lastMessage: string
  updatedAt: number
  isSeen: boolean
  unreadCount: number
  user: User
}

export interface UserChats {
  chats: IChat[]
}
