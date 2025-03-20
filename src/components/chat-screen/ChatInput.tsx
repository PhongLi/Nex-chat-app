import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { useState } from 'react'

// **MUI
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import TelegramIcon from '@mui/icons-material/Telegram'
import { IconButton, InputBase, Popover, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'

// **firebase
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useChatStore } from '../../store/chatStore'
import { useUserStore } from '../../store/userStore'
import { UserChats } from '../../types'

const StyledChatInputContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  margin: theme.spacing(2, 4, 0, 4),
  border: '1px solid',
  borderColor: theme.palette.divider,
  '& .emoji-picker': {
    position: 'absolute',
    top: '100%',
    right: 0,
    zIndex: 1,
  },
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: '20px',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
  },
}))

export const ChatInput = () => {
  const [text, setText] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { currentUser } = useUserStore()
  const { chatId, user } = useChatStore()

  const handleEmoji = (emojiData: EmojiClickData) => {
    setText(prev => prev + emojiData.emoji)
  }

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  const updateUserChats = async (
    userId: string,
    chatId: string,
    message: string,
    senderId: string
  ) => {
    const userChatsRef = doc(db, 'userchats', userId)
    const userChatsSnapshot = await getDoc(userChatsRef)

    if (!userChatsSnapshot.exists()) return
    const userChatsData = userChatsSnapshot.data() as UserChats

    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)
    if (chatIndex === -1) return

    userChatsData.chats[chatIndex].lastMessage = message
    userChatsData.chats[chatIndex].updatedAt = Date.now()

    if (userId !== senderId) {
      userChatsData.chats[chatIndex].unreadCount =
        (userChatsData.chats[chatIndex].unreadCount || 0) + 1
    }

    await updateDoc(userChatsRef, { chats: userChatsData.chats })
  }

  const handleSend = async () => {
    const message = text.trim()
    if (message === '' || !chatId) return
    if (!currentUser?.id || !user?.id) return

    try {
      // Cập nhật tin nhắn vào Firestore (collection "chats")
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: message,
          createdAt: new Date(),
        }),
      })

      await updateUserChats(currentUser.id, chatId, message, currentUser.id)
      await updateUserChats(user.id, chatId, message, currentUser.id)
    } catch (err) {
      console.log(err)
    } finally {
      setText('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <StyledChatInputContainer>
      <IconButton onClick={handleEmojiClick} sx={{ position: 'relative' }}>
        <SentimentSatisfiedOutlinedIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <EmojiPicker onEmojiClick={handleEmoji} />
      </Popover>
      <StyledInputBase
        placeholder='Type a message...'
        multiline
        maxRows={4}
        fullWidth
        value={text}
        onKeyDown={handleKeyDown}
        onChange={e => setText(e.target.value)}
      />
      <IconButton sx={{ p: 1 }}>
        <AttachFileIcon />
      </IconButton>
      <IconButton onClick={handleSend}>
        <TelegramIcon />
      </IconButton>
    </StyledChatInputContainer>
  )
}
