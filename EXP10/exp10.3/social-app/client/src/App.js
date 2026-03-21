import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { FeedPage, ExplorePage, ProfilePage, LoginPage, RegisterPage } from './pages/Pages';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { mode: 'dark', primary: { main: '#3a86ff' } },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"           element={<FeedPage />} />
        <Route path="/explore"    element={<ExplorePage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
