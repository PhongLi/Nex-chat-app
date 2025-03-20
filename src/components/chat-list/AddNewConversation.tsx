import { useState } from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useUserStore } from '../../store/userStore'
import { User } from '../../types'

export const AddNewConversation = () => {
  const [user, setUser] = useState<User | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const { currentUser } = useUserStore()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const username = input.trim()

    try {
      const userRef = collection(db, 'users')
      const q = query(userRef, where('username', '==', username))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data() as User)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // TODO: Ensure that the user cannot create a chat with themselves
  // Also, check if the user already has an existing chat with the selected user
  // If an existing chat is found, prevent creating a new chat
  const handleAdd = async () => {
    const chatRef = collection(db, 'chats')
    const userChatsRef = collection(db, 'userchats')

    try {
      // Create a new chat
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })

      // Update both users' chats with new chatId
      await updateDoc(doc(userChatsRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: currentUser?.id,
          updatedAt: Date.now(),
        }),
      })

      await updateDoc(doc(userChatsRef, currentUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: user?.id,
          updatedAt: Date.now(),
        }),
      })

      setOpen(false) // Close the dialog after adding user
      setUser(null) // Clear user state
      setInput('') // Reset input field
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box>
      <IconButton onClick={() => setOpen(true)}>
        <AddCommentIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSearch}>
            <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
              <TextField
                variant='standard'
                fullWidth
                placeholder='Username'
                size='small'
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <Button
                variant='contained'
                color='primary'
                type='submit'
                size='small'
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Stack>
          </form>
          {user && (
            <Stack
              direction='row'
              spacing={2}
              onClick={handleAdd}
              sx={{ alignItems: 'center', my: 2, cursor: 'pointer' }}
            >
              <Avatar src={user.avatar} alt='Avatar' />
              <Typography variant='body2'>{user.username}</Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
