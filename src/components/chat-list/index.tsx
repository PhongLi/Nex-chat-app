/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
// **MUI
import { Box, Divider, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'
// **Components
import { AddNewConversation } from './AddNewConversation'
import { ConversationCard } from './ConversationCard'
// **Firebase
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useUserStore } from '../../store/userStore'
import { useChatStore } from '../../store/chatStore'
import { Chat, User } from '../../types'

const StyledContainer = styled(Box)(() => ({
  minWidth: 350,
  maxWidth: 400,
}))

const StyledSearch = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  padding: theme.spacing(2),
}))

const StyledSearchInput = styled(TextField)(() => ({
  outline: 'none',
  border: 'none',
  flex: 1,
}))

function ChatList() {
  const { currentUser } = useUserStore()
  const { changeChat } = useChatStore()

  const [chats, setChats] = useState<Chat[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!currentUser?.id) return

    const unSub = onSnapshot(
      doc(db, 'userchats', currentUser?.id),
      async res => {
        const items = res?.data()?.chats
        const promises = items.map(async item => {
          const userDocRef = doc(db, 'users', item.receiverId)
          const userDocSnap = await getDoc(userDocRef)
          const user = userDocSnap.data() as User

          return { ...item, user }
        })

        const chatData = await Promise.all(promises)
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
      }
    )

    return () => {
      unSub()
    }
  }, [currentUser?.id])

  const handleSelect = async (chat: Chat) => {
    const userChats = chats.map(item => {
      const { user, ...rest } = item
      return rest
    })

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)
    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true
      userChats[chatIndex].unreadCount = 0
    }

    const userChatsRef = doc(db, 'userchats', currentUser?.id ?? '')
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      })
      changeChat(chat.chatId, chat.user)
    } catch (err) {
      console.log(err)
    }
  }

  const filteredChats = chats.filter(c =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  )

  return (
    <StyledContainer>
      <Stack
        direction='row'
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <StyledSearch>
          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <StyledSearchInput
            variant='standard'
            placeholder='Search'
            onChange={e => setInput(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
          />
        </StyledSearch>
        <AddNewConversation />
      </Stack>
      <Divider />
      <>
        {filteredChats.map(chat => (
          <ConversationCard
            key={chat.chatId}
            avatarUrl={chat.user.avatar}
            userName={chat.user.username}
            lastMessage={chat.lastMessage}
            updatedAt={chat.updatedAt}
            unreadCount={chat.unreadCount}
            handleSelect={() => handleSelect(chat)}
          />
        ))}
      </>
    </StyledContainer>
  )
}

export default ChatList
