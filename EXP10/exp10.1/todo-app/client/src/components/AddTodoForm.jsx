import { useState } from 'react';
import {
  Box, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Collapse, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { createTodo } from '../api';

const PRIORITY_COLORS = { low: '#2a9d8f', medium: '#f4a261', high: '#e63946' };

const AddTodoForm = ({ onAdded }) => {
  const [form, setForm]         = useState({ title: '', description: '', priority: 'medium' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true); setError('');
    try {
      const res = await createTodo(form);
      onAdded(res.data.data);
      setForm({ title: '', description: '', priority: 'medium' });
      setExpanded(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add todo');
    } finally { setLoading(false); }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}
      sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, p: 3, border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
      <Box display="flex" gap={1.5} alignItems="flex-start">
        <TextField
          fullWidth
          placeholder="Add a new todo..."
          value={form.title}
          onChange={(e) => { setForm({ ...form, title: e.target.value }); setError(''); }}
          error={!!error}
          helperText={error}
          size="small"
          sx={fieldSx}
        />
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
            sx={{ color: PRIORITY_COLORS[form.priority], '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' }, '.MuiSvgIcon-root': { color: 'rgba(255,255,255,0.4)' } }}>
            {['low', 'medium', 'high'].map(p => (
              <MenuItem key={p} value={p} sx={{ color: PRIORITY_COLORS[p], textTransform: 'capitalize' }}>{p}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton onClick={() => setExpanded(e => !e)} size="small" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.3 }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Button type="submit" variant="contained" disabled={loading} startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' }, flexShrink: 0, height: 40 }}>
          Add
        </Button>
      </Box>

      <Collapse in={expanded}>
        <TextField fullWidth multiline rows={2} placeholder="Description (optional)"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          size="small" sx={{ ...fieldSx, mt: 1.5 }} />
      </Collapse>
    </Box>
  );
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: '#3a86ff' },
  },
  '& input, & textarea': { color: '#fff' },
  '& input::placeholder, & textarea::placeholder': { color: 'rgba(255,255,255,0.3)' },
  '& .MuiFormHelperText-root': { color: '#ff6b6b' },
};

export default AddTodoForm;
