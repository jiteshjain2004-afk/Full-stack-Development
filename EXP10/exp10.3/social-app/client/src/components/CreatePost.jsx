import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Avatar, TextField, Button, Chip, Collapse } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import api from '../api';

export default function CreatePost({ onCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [tags,    setTags]    = useState('');
  const [image,   setImage]   = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const payload = {
        content,
        image,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const res = await api.post('/posts', payload);
      onCreated && onCreated(res.data.data);
      setContent(''); setTags(''); setImage(''); setExpanded(false);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', p: 2.5, mb: 3 }}>
      <Box display="flex" gap={1.5}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#3a86ff', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <TextField fullWidth multiline rows={expanded ? 3 : 2}
            placeholder={`What's on your mind, ${user?.username}?`}
            value={content} onChange={(e) => { setContent(e.target.value); if (!expanded) setExpanded(true); }}
            onFocus={() => setExpanded(true)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&.Mui-focused fieldset': { borderColor: '#3a86ff' } }, '& textarea': { color: '#fff' }, '& textarea::placeholder': { color: 'rgba(255,255,255,0.3)' } }} />

          <Collapse in={expanded}>
            <Box mt={1.5} display="flex" flexDirection="column" gap={1.5}>
              <TextField fullWidth size="small" placeholder="Tags (comma separated): react, javascript..."
                value={tags} onChange={(e) => setTags(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' } }, '& input': { color: '#fff', fontSize: '0.82rem' }, '& input::placeholder': { color: 'rgba(255,255,255,0.3)' } }} />
              <TextField fullWidth size="small" placeholder="Image URL (optional)"
                value={image} onChange={(e) => setImage(e.target.value)}
                InputProps={{ startAdornment: <ImageIcon sx={{ color: 'rgba(255,255,255,0.3)', mr: 1, fontSize: 18 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' } }, '& input': { color: '#fff', fontSize: '0.82rem' } }} />
            </Box>
          </Collapse>

          <Box display="flex" justifyContent="flex-end" mt={1.5} gap={1}>
            {expanded && (
              <Button size="small" onClick={() => { setExpanded(false); setContent(''); setTags(''); setImage(''); }}
                sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.4)' }}>Cancel</Button>
            )}
            <Button size="small" variant="contained" onClick={handleSubmit} disabled={loading || !content.trim()}
              sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' }, '&:disabled': { bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' } }}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
