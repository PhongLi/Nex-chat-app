import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            light: '#74CAFF',
            main: '#1890FF',
            dark: '#0C53B7',
        },
    },
    typography: {
        fontFamily: 'Inter, Nunito Sans, Lexend, Noto Sans, sans-serif',
    },
})

export default theme
