import { type JSX } from 'react'
import {
  CalendarToday,
  Chat,
  Description,
  Folder,
  Settings,
} from '@mui/icons-material'
import {
  Avatar,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { auth } from '../../config/firebase'
import { useChatStore } from '../../store/chatStore'
import { useUserStore } from '../../store/userStore'
import { getFirstLetter } from '../../utils/getFirstLetter'

interface MenuItem {
  id: string
  text: string
  icon: JSX.Element
}

function Sidebar() {
  const { currentUser } = useUserStore()
  const { resetChat } = useChatStore()
  const selectedId = 'chat'

  const menuItems: MenuItem[] = [
    { id: 'properties', text: 'Properties', icon: <Folder /> },
    { id: 'chat', text: 'Chat', icon: <Chat /> },
    { id: 'calendar', text: 'Calendar', icon: <CalendarToday /> },
    { id: 'offer', text: 'Offer', icon: <CalendarToday /> },
    { id: 'documents', text: 'Documents', icon: <Description /> },
    { id: 'settings', text: 'Settings', icon: <Settings /> },
  ]
  const handleLogout = () => {
    auth.signOut()
    resetChat()
  }

  return (
    <Stack sx={{ width: 240, flexShrink: 0 }}>
      <Stack
        sx={{
          width: '100%',
          my: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Avatar section */}
        <Avatar
          alt={currentUser?.username}
          src={currentUser?.avatar}
          sx={{ width: 80, height: 80, marginBottom: 2 }}
        >
          {getFirstLetter(currentUser?.username)}
        </Avatar>
        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
          {currentUser?.username}
        </Typography>
      </Stack>
      <List>
        {menuItems.map(item => (
          <ListItemButton
            key={item.id}
            selected={selectedId === item.id}
            sx={{
              '&.Mui-selected': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                '.MuiSvgIcon-root': {
                  color: 'primary.main',
                },
              },
              '.MuiSvgIcon-root': {
                fontSize: 20,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: 'uppercase',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Button variant='contained' sx={{ mx: 2 }} onClick={handleLogout}>
        Logout
      </Button>
    </Stack>
  )
}

export default Sidebar
