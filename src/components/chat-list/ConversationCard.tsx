import { Avatar, Box, Card, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { formatTimestamp } from '../../utils/formatTimestamp'
import { getFirstLetter } from '../../utils/getFirstLetter'

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5),
  margin: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  maxWidth: 500,
}))

const StyledUserInfo = styled(Stack)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flex: 1,
}))

const StyledMessagePreview = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 180,
}))

const StyledTimeStamp = styled(Stack)(() => ({
  alignItems: 'flex-end',
  justifyContent: 'space-around',
  marginLeft: 'auto',
  minWidth: 64,
}))

const StyledTimeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  textAlign: 'right',
}))

const StyledBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.error.main,
  borderRadius: '50%',
  minWidth: 18,
  minHeight: 18,
  fontSize: '10px',
}))

type ConversationCardProps = {
  avatarUrl: string
  userName: string
  unreadCount?: number
  lastMessage?: string
  updatedAt: number
  handleSelect: () => void
}

export const ConversationCard = ({
  avatarUrl,
  userName,
  unreadCount = 0,
  lastMessage,
  updatedAt,
  handleSelect,
}: ConversationCardProps) => {
  return (
    <StyledCard
      elevation={6}
      aria-label={`Chat with ${userName}`}
      onClick={handleSelect}
    >
      <Avatar alt={userName} src={avatarUrl} sx={{ width: 48, height: 48 }}>
        {getFirstLetter(userName)}
      </Avatar>

      <StyledUserInfo>
        <Typography variant='subtitle1' component='h2' fontWeight='bold'>
          {userName}
        </Typography>
        <StyledMessagePreview variant='body2'>
          {lastMessage}
        </StyledMessagePreview>
      </StyledUserInfo>

      <StyledTimeStamp>
        <StyledTimeText>{formatTimestamp(updatedAt)}</StyledTimeText>
        {unreadCount > 0 && (
          <StyledBadge>{unreadCount > 9 ? '9+' : unreadCount}</StyledBadge>
        )}
      </StyledTimeStamp>
    </StyledCard>
  )
}
