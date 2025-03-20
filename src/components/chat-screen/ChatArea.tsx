import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
// **MUI
import { Avatar, Box, Paper, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
// **firebase
import { doc, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
// **store
import { useChatStore } from '../../store/chatStore'
import { useUserStore } from '../../store/userStore'
import { getFirstLetter } from '../../utils/getFirstLetter'

const StyledContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
}))

const MessageBubble = styled(Paper)<{ isReceived: boolean }>(
  ({ theme, isReceived }) => ({
    maxWidth: '50%',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: '24px',
    backgroundColor: isReceived
      ? theme.palette.common.white
      : theme.palette.primary.main,
    color: isReceived ? theme.palette.common.black : theme.palette.common.white,
    alignSelf: isReceived ? 'flex-start' : 'flex-end',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflowWrap: 'anywhere',
  })
)

const StyledMessageRow = styled(Box)<{ isReceived: boolean }>(
  ({ theme, isReceived }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: isReceived ? 'row' : 'row-reverse',
    marginBottom: theme.spacing(2),
  })
)

const StyledTimeStamp = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}))

interface Message {
  id: string
  senderId: string
  text: string
  createdAt: Timestamp
}

interface ChatData {
  messages: Message[]
}

export const ChatArea = () => {
  const [chat, setChat] = useState<ChatData | null>(null)
  const { chatId, user } = useChatStore()
  const { currentUser } = useUserStore()

  const endRef = useRef<HTMLDivElement>(null)

  const checkIsReceived = (senderId: string) => senderId !== currentUser?.id

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  useEffect(() => {
    if (!chatId) return
    const unsub = onSnapshot(doc(db, 'chats', chatId), res => {
      const data = res.data() as ChatData | undefined
      setChat(data || null)
    })
    return () => {
      unsub()
    }
  }, [chatId])

  return (
    <StyledContainer>
      <Stack spacing={2}>
        {chat?.messages?.map(message => {
          const isReceived = checkIsReceived(message.senderId)
          return (
            <StyledMessageRow key={message.id} isReceived={isReceived}>
              {isReceived && user?.avatar && (
                <Box>
                  <Avatar
                    src={user.avatar}
                    alt={user.username}
                    sx={{ width: 40, height: 40 }}
                  >
                    {getFirstLetter(user?.username)}
                  </Avatar>
                  <StyledTimeStamp variant='caption'>
                    {dayjs(message.createdAt.toDate()).format('hh:mm A')}
                  </StyledTimeStamp>
                </Box>
              )}
              <MessageBubble
                isReceived={isReceived}
                elevation={1}
                role='article'
                aria-label={`${isReceived ? 'Received' : 'Sent'} message: ${
                  message.text
                }`}
              >
                <Typography variant='body2'>{message.text}</Typography>
              </MessageBubble>
            </StyledMessageRow>
          )
        })}
      </Stack>
      <div ref={endRef}></div>
    </StyledContainer>
  )
}
