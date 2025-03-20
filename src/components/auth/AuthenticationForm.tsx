import { useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
  Stack,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// **firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { auth, db } from '../../config/firebase'
import { getRandomAvatar } from '../../utils/getRandomAvatar'

const StyledContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
})

const FormWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: 800,
  padding: theme.spacing(2),
}))

const StyledFormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: 1,
}))

const AuthenticationForm = () => {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const { email, password } = Object.fromEntries(formData) as {
      email: string
      password: string
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
      enqueueSnackbar('Logged in successfully!', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar((err as Error).message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const { username, email, password } = Object.fromEntries(formData) as {
      username: string
      email: string
      password: string
    }

    if (!username || !email || !password) {
      setLoading(false)
      return
    }

    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('username', '==', username))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      return enqueueSnackbar('Username already exists', { variant: 'error' })
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const avatarUrl = getRandomAvatar(Math.floor(Math.random() * 70) + 1)

      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        avatar: avatarUrl,
        id: res.user.uid,
      })

      await setDoc(doc(db, 'userchats', res.user.uid), {
        chats: [],
      })
      enqueueSnackbar('Account created! You can login now!', {
        variant: 'success',
      })
    } catch (err) {
      console.error(err)
      enqueueSnackbar((err as Error).message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledContainer>
      <FormWrapper>
        {/*Login Form */}
        <StyledFormBox>
          <Typography variant='h5' gutterBottom>
            Welcome back,
          </Typography>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                type='email'
                variant='outlined'
                required
              />
              <TextField
                fullWidth
                label='Password'
                name='password'
                type='password'
                variant='outlined'
                required
              />
              <Button
                fullWidth
                variant='contained'
                color='primary'
                type='submit'
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Stack>
          </form>
        </StyledFormBox>

        <Divider orientation='vertical' flexItem />

        {/* Register Form */}
        <StyledFormBox>
          <Typography variant='h5' gutterBottom>
            Create an Account
          </Typography>
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label='Username'
                name='username'
                variant='outlined'
                required
              />
              <TextField
                fullWidth
                label='Email'
                name='email'
                type='email'
                variant='outlined'
                required
              />
              <TextField
                fullWidth
                label='Password'
                name='password'
                type='password'
                variant='outlined'
                required
              />
              <Button
                fullWidth
                variant='contained'
                color='primary'
                type='submit'
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
            </Stack>
          </form>
        </StyledFormBox>
      </FormWrapper>
    </StyledContainer>
  )
}

export default AuthenticationForm
