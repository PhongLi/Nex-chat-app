import { Stack } from '@mui/material'
import { Header } from './Header'
import { styled } from '@mui/material/styles'
import { ChatInput } from './ChatInput'
import { ChatArea } from './ChatArea'

const StyledContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  paddingBottom: theme.spacing(2),
}))

function ChatScreen() {
  return (
    <StyledContainer>
      <Header />
      <ChatArea />
      <ChatInput />
    </StyledContainer>
  )
}

export default ChatScreen
