import { useState } from 'react';
import {
  Box, Typography, IconButton, Checkbox, Chip,
  TextField, Tooltip, Fade,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { updateTodo, toggleTodo, deleteTodo } from '../api';

const PRIORITY = { low: '#2a9d8f', medium: '#f4a261', high: '#e63946' };

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing]   = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [loading, setLoading]   = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleTodo(todo._id);
      onUpdate(res.data.data);
    } finally { setLoading(false); }
  };

  const handleEdit = async () => {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      const res = await updateTodo(todo._id, { title: editTitle });
      onUpdate(res.data.data);
      setEditing(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTodo(todo._id);
      onDelete(todo._id);
    } finally { setLoading(false); }
  };

  return (
    <Fade in>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        p: 2, borderRadius: 2.5,
        bgcolor: todo.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${todo.completed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)'}`,
        mb: 1.5, transition: 'all 0.2s',
        '&:hover': { borderColor: 'rgba(58,134,255,0.3)', bgcolor: 'rgba(58,134,255,0.04)' },
        opacity: loading ? 0.6 : 1,
      }}>
        {/* Checkbox */}
        <Checkbox
          checked={todo.completed}
          onChange={handleToggle}
          disabled={loading}
          sx={{
            color: 'rgba(255,255,255,0.2)',
            '&.Mui-checked': { color: '#2a9d8f' },
            p: 0.5,
          }}
        />

        {/* Title / Edit */}
        <Box flex={1} minWidth={0}>
          {editing ? (
            <TextField
              fullWidth size="small" value={editTitle} autoFocus
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(); if (e.key === 'Escape') setEditing(false); }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.07)', color: '#fff',
                  '& fieldset': { borderColor: '#3a86ff' },
                },
                '& input': { color: '#fff', py: 0.8 },
              }}
            />
          ) : (
            <Box>
              <Typography
                fontWeight={600} fontSize="0.9rem"
                sx={{
                  color: todo.completed ? 'rgba(255,255,255,0.3)' : '#fff',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}
              >
                {todo.title}
              </Typography>
              {todo.description && (
                <Typography fontSize="0.75rem" color="rgba(255,255,255,0.3)" noWrap>
                  {todo.description}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Priority chip */}
        <Chip
          label={todo.priority}
          size="small"
          sx={{
            bgcolor: `${PRIORITY[todo.priority]}18`,
            color: PRIORITY[todo.priority],
            border: `1px solid ${PRIORITY[todo.priority]}33`,
            fontSize: '0.65rem', fontWeight: 700,
            textTransform: 'capitalize', flexShrink: 0,
          }}
        />

        {/* Actions */}
        {editing ? (
          <Box display="flex" gap={0.5}>
            <IconButton size="small" onClick={handleEdit} sx={{ color: '#2a9d8f' }}><CheckIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => setEditing(false)} sx={{ color: 'rgba(255,255,255,0.3)' }}><CloseIcon fontSize="small" /></IconButton>
          </Box>
        ) : (
          <Box display="flex" gap={0.5}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => { setEditing(true); setEditTitle(todo.title); }}
                sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#3a86ff' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete} disabled={loading}
                sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#e63946' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default TodoItem;
