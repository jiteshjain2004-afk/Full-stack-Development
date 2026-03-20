import { useState } from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { mode: 'dark', primary: { main: '#3a86ff' } },
});

function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #0a1628 100%)',
        }}
      >
        {user
          ? <Dashboard user={user} onLogout={() => setUser(null)} />
          : <LoginForm onSuccess={setUser} />
        }
      </Box>
    </ThemeProvider>
  );
}

export default App;
