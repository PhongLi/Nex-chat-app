import { useEffect } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
// **components
import AuthenticationForm from './components/auth/AuthenticationForm'
import ChatList from './components/chat-list'
import ChatScreen from './components/chat-screen'
import Sidebar from './components/sidebar'
// **firebase
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { useChatStore } from './store/chatStore'
import { useUserStore } from './store/userStore'

const StyledRoot = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
}))

const StyledContainer = styled(Box)(({ theme }) => ({
  height: '90vh',
  width: '80vw',
  minWidth: 1000,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}))
function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const { chatId } = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, user => {
      fetchUserInfo(user?.uid)
    })

    return () => {
      unSub()
    }
  }, [fetchUserInfo])

  if (isLoading) return <div>Loading...</div>
  return (
    <StyledRoot>
      <StyledContainer>
        {currentUser ? (
          <Stack direction='row' sx={{ width: '100%', height: '100%' }}>
            <Sidebar />
            <Divider orientation='vertical' />
            <Stack direction='row' sx={{ width: '100%', height: '100%' }}>
              <ChatList />
              <Divider orientation='vertical' />
              {chatId ? (
                <ChatScreen />
              ) : (
                <Stack
                  sx={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant='subtitle2'
                    sx={{
                      px: 2,
                      py: 0.5,
                      bgcolor: 'grey.600',
                      color: 'common.white',
                      borderRadius: 8,
                    }}
                  >
                    Select a chat to start messaging
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        ) : (
          <AuthenticationForm />
        )}
      </StyledContainer>
    </StyledRoot>
  )
}

export default App
