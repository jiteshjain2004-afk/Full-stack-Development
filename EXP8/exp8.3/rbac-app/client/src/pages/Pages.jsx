import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Avatar,
  IconButton, Select, MenuItem, CircularProgress, Alert, Tooltip,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ROLE_COLOR = { admin: '#e63946', moderator: '#f4a261', user: '#2a9d8f' };

export const AdminPage = () => {
  const { user: me } = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = async () => {
    try { const r = await api.get('/users'); setUsers(r.data.users); }
    catch (e) { setError(e.response?.data?.error || 'Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    setUsers(u => u.map(x => x._id === id ? { ...x, role } : x));
  };

  const toggleStatus = async (id, isActive) => {
    await api.put(`/users/${id}/status`, { isActive });
    setUsers(u => u.map(x => x._id === id ? { ...x, isActive } : x));
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    setUsers(u => u.filter(x => x._id !== id));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 } }}>
      <Box maxWidth={960} mx="auto">
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <AdminPanelSettingsIcon sx={{ color: '#e63946', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#fff">Admin Dashboard</Typography>
            <Typography color="rgba(255,255,255,0.4)" fontSize="0.85rem">Manage users and roles</Typography>
          </Box>
          <Chip label="Admin Only" sx={{ ml: 'auto', bgcolor: 'rgba(230,57,70,0.15)', color: '#e63946', border: '1px solid rgba(230,57,70,0.3)', fontWeight: 700 }} />
        </Box>

        {loading && <Box textAlign="center" py={5}><CircularProgress sx={{ color: '#3a86ff' }} /></Box>}
        {error && <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>{error}</Alert>}

        <Grid container spacing={2}>
          {users.map((u) => (
            <Grid item xs={12} sm={6} key={u._id}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Avatar sx={{ bgcolor: ROLE_COLOR[u.role], fontWeight: 800, width: 38, height: 38 }}>{u.username[0].toUpperCase()}</Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={700} color="#fff" fontSize="0.9rem">
                        {u.username} {u._id === me?._id && <Chip label="You" size="small" sx={{ ml: 0.5, height: 16, fontSize: '0.6rem', bgcolor: 'rgba(58,134,255,0.2)', color: '#3a86ff' }} />}
                      </Typography>
                      <Typography fontSize="0.72rem" color="rgba(255,255,255,0.35)">{u.email}</Typography>
                    </Box>
                    <Chip label={u.isActive ? 'Active' : 'Inactive'} size="small"
                      sx={{ bgcolor: u.isActive ? 'rgba(42,157,143,0.15)' : 'rgba(255,255,255,0.05)', color: u.isActive ? '#2a9d8f' : 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }} />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Select value={u.role} size="small" onChange={(e) => updateRole(u._id, e.target.value)} disabled={u._id === me?._id}
                      sx={{ flex: 1, color: ROLE_COLOR[u.role], fontSize: '0.8rem', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '.MuiSvgIcon-root': { color: 'rgba(255,255,255,0.4)' } }}>
                      {['user', 'moderator', 'admin'].map(r => <MenuItem key={r} value={r} sx={{ fontSize: '0.82rem' }}>{r}</MenuItem>)}
                    </Select>
                    <Tooltip title={u.isActive ? 'Deactivate' : 'Activate'}>
                      <IconButton size="small" onClick={() => toggleStatus(u._id, !u.isActive)} disabled={u._id === me?._id}
                        sx={{ color: u.isActive ? '#f4a261' : '#2a9d8f' }}>
                        {u.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete user">
                      <IconButton size="small" onClick={() => deleteUser(u._id)} disabled={u._id === me?._id} sx={{ color: '#e63946' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export const ModeratorPage = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 } }}>
    <Box maxWidth={900} mx="auto">
      <Typography variant="h4" fontWeight={900} color="#fff" mb={1}>Moderator Panel</Typography>
      <Chip label="Moderator + Admin" sx={{ mb: 3, bgcolor: 'rgba(244,162,97,0.15)', color: '#f4a261', border: '1px solid rgba(244,162,97,0.3)', fontWeight: 700 }} />
      <Grid container spacing={2}>
        {[{ label: 'Pending Reports', value: 3, color: '#e63946' }, { label: 'Flagged Posts', value: 7, color: '#f4a261' }, { label: 'Resolved Today', value: 12, color: '#2a9d8f' }].map(s => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', p: 3 }}>
              <Typography variant="h3" fontWeight={900} sx={{ color: s.color }}>{s.value}</Typography>
              <Typography color="rgba(255,255,255,0.5)" fontSize="0.85rem">{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export const ProfilePage = () => {
  const { user } = useAuth();
  const roleColor = { admin: '#e63946', moderator: '#f4a261', user: '#2a9d8f' }[user?.role];
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Box maxWidth={500} width="100%">
        <Card elevation={0} sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Avatar sx={{ mx: 'auto', mb: 2, width: 72, height: 72, bgcolor: roleColor, fontSize: '1.8rem', fontWeight: 900 }}>{user?.username?.[0]?.toUpperCase()}</Avatar>
            <Typography variant="h5" fontWeight={900} color="#fff">{user?.username}</Typography>
            <Typography color="rgba(255,255,255,0.4)" mb={2}>{user?.email}</Typography>
            <Chip label={user?.role?.toUpperCase()} sx={{ bgcolor: `${roleColor}22`, color: roleColor, fontWeight: 800, border: `1px solid ${roleColor}44` }} />
            <Box sx={{ mt: 3, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 2, textAlign: 'left' }}>
              <Typography fontFamily="monospace" fontSize="0.78rem" color="rgba(255,255,255,0.6)">
                {`{\n  "id": "${user?._id}",\n  "username": "${user?.username}",\n  "role": "${user?.role}",\n  "isActive": ${user?.isActive}\n}`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export const AccessDeniedPage = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <BlockIcon sx={{ fontSize: 90, color: '#e63946', mb: 2 }} />
    <Typography variant="h3" fontWeight={900} color="#fff" mb={1}>Access Denied</Typography>
    <Typography color="rgba(255,255,255,0.4)" mb={1}>You don't have permission to view this page.</Typography>
    <Typography color="rgba(255,255,255,0.25)" fontSize="0.85rem">This is the expected output for Experiment 8.3 RBAC</Typography>
  </Box>
);
