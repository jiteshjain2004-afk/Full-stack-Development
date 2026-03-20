import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { primary: { main: '#e63946' }, mode: 'dark' },
});

function App() {
  const [username, setUsername] = useState('');

  return (
    <ThemeProvider theme={theme}>
      {username
        ? <ChatRoom username={username} onLeave={() => setUsername('')} />
        : <Login onJoin={setUsername} />
      }
    </ThemeProvider>
  );
}

export default App;
