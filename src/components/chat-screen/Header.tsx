import { Divider, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useChatStore } from '../../store/chatStore'

const StyledChatHeader = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  minHeight: 64,
  justifyContent: 'center',
  paddingLeft: theme.spacing(2),
}))

export const Header = () => {
  const { user } = useChatStore()
  return (
    <>
      <StyledChatHeader>
        <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
          {user?.username}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          Last recently seen
        </Typography>
      </StyledChatHeader>
      <Divider variant='fullWidth' />
    </>
  )
}
