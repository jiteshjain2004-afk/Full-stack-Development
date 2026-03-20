import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, createTheme, ThemeProvider, Chip,
  CircularProgress, Alert, Button, Divider, LinearProgress,
  ToggleButtonGroup, ToggleButton, TextField, InputAdornment,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getTodos, clearDone } from './api';
import AddTodoForm from './components/AddTodoForm';
import TodoItem from './components/TodoItem';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { mode: 'dark', primary: { main: '#3a86ff' } },
});

export default function App() {
  const [todos, setTodos]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (filter === 'active')    params.completed = false;
      if (filter === 'completed') params.completed = true;
      if (search) params.search = search;
      const res = await getTodos(params);
      setTodos(res.data.data);
    } catch (err) {
      setError('Failed to load todos. Make sure the server is running.');
    } finally { setLoading(false); }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const handleAdded   = (todo) => setTodos(prev => [todo, ...prev]);
  const handleUpdated = (todo) => setTodos(prev => prev.map(t => t._id === todo._id ? todo : t));
  const handleDeleted = (id)   => setTodos(prev => prev.filter(t => t._id !== id));

  const handleClearDone = async () => {
    await clearDone();
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const total     = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const progress  = total > 0 ? (completed / total) * 100 : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', py: { xs: 3, md: 5 }, px: 2 }}>
        <Box maxWidth={680} mx="auto">

          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={1.5} mb={1}>
              <AssignmentIcon sx={{ fontSize: 36, color: '#3a86ff' }} />
              <Typography variant="h3" fontWeight={900} color="#fff" letterSpacing={-1}>
                Todo<span style={{ color: '#3a86ff' }}>App</span>
              </Typography>
            </Box>
            <Typography color="rgba(255,255,255,0.4)" fontSize="0.85rem">
              MERN Stack · Full CRUD · MongoDB
            </Typography>
          </Box>

          {/* Progress */}
          {total > 0 && (
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontSize="0.8rem" color="rgba(255,255,255,0.4)">
                  {completed} of {total} completed
                </Typography>
                <Typography fontSize="0.8rem" color="#3a86ff" fontWeight={700}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress}
                sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: '#3a86ff', borderRadius: 3 } }} />
            </Box>
          )}

          {/* Add form */}
          <AddTodoForm onAdded={handleAdded} />

          {/* Filters + Search */}
          <Box display="flex" gap={1.5} mb={2.5} flexWrap="wrap" alignItems="center">
            <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
              {['all', 'active', 'completed'].map(f => (
                <ToggleButton key={f} value={f}
                  sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize', px: 2,
                    '&.Mui-selected': { bgcolor: 'rgba(58,134,255,0.15)', color: '#3a86ff', borderColor: 'rgba(58,134,255,0.3)' } }}>
                  {f}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <TextField size="small" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} /></InputAdornment> }}
              sx={{ flex: 1, minWidth: 140, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& input': { color: '#fff', py: 1 } }} />

            {completed > 0 && (
              <Button size="small" startIcon={<DeleteSweepIcon />} onClick={handleClearDone}
                sx={{ borderRadius: 2, color: '#e63946', borderColor: 'rgba(230,57,70,0.3)', border: '1px solid', '&:hover': { bgcolor: 'rgba(230,57,70,0.08)' }, flexShrink: 0 }}>
                Clear done
              </Button>
            )}
          </Box>

          {/* Stats */}
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            {[
              { label: `${total} Total`, color: '#3a86ff' },
              { label: `${todos.filter(t => !t.completed).length} Active`, color: '#f4a261' },
              { label: `${completed} Done`, color: '#2a9d8f' },
              { label: `${todos.filter(t => t.priority === 'high').length} High`, color: '#e63946' },
            ].map(s => (
              <Chip key={s.label} label={s.label} size="small"
                sx={{ bgcolor: `${s.color}12`, color: s.color, border: `1px solid ${s.color}25`, fontWeight: 700, fontSize: '0.72rem' }} />
            ))}
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 2 }} />

          {/* Loading */}
          {loading && (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress sx={{ color: '#3a86ff' }} />
            </Box>
          )}

          {/* Error */}
          {!loading && error && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}
              action={<Button size="small" onClick={load} sx={{ color: '#ff6b6b' }}>Retry</Button>}>
              {error}
            </Alert>
          )}

          {/* Empty */}
          {!loading && !error && todos.length === 0 && (
            <Box textAlign="center" py={8}>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
              <Typography color="rgba(255,255,255,0.3)" fontWeight={600}>
                {filter === 'completed' ? 'No completed todos yet!' : 'No todos yet — add one above!'}
              </Typography>
            </Box>
          )}

          {/* Todo list */}
          {!loading && !error && todos.map(todo => (
            <TodoItem key={todo._id} todo={todo} onUpdate={handleUpdated} onDelete={handleDeleted} />
          ))}

        </Box>
      </Box>
    </ThemeProvider>
  );
}
