import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { AdminPage, ModeratorPage, ProfilePage, AccessDeniedPage } from './pages/Pages';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { mode: 'dark', primary: { main: '#3a86ff' } },
});

const Layout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <><Navbar /><Outlet /></> : <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/moderator"  element={<ProtectedRoute roles={['moderator','admin']}><ModeratorPage /></ProtectedRoute>} />
        <Route path="/admin"      element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
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
