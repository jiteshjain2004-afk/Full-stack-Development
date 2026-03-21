import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Avatar, IconButton, Chip, TextField, Button, Divider, Collapse } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import api from '../api';

export default function PostCard({ post, onUpdate, onDelete }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [liked,      setLiked]      = useState(post.likes?.includes(user?._id));
  const [likeCount,  setLikeCount]  = useState(post.likes?.length || 0);
  const [comments,   setComments]   = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editing,    setEditing]    = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const handleLike = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const res = await api.patch(`/posts/${post._id}/like`);
    setLiked(res.data.liked); setLikeCount(res.data.likes);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await api.post(`/posts/${post._id}/comments`, { content: newComment });
    setComments(prev => [res.data.data, ...prev]);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/posts/${post._id}/comments/${commentId}`);
    setComments(prev => prev.filter(c => c._id !== commentId));
  };

  const handleEdit = async () => {
    const res = await api.put(`/posts/${post._id}`, { content: editContent });
    onUpdate && onUpdate(res.data.data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${post._id}`);
    onDelete && onDelete(post._id);
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', mb: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2} pb={1}>
        <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: 'pointer' }}
          onClick={() => navigate(`/profile/${post.author?._id}`)}>
          <Avatar sx={{ width: 38, height: 38, bgcolor: '#3a86ff', fontWeight: 800, fontSize: '0.9rem' }}>
            {post.author?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={700} color="#fff" fontSize="0.9rem">@{post.author?.username}</Typography>
            <Typography fontSize="0.7rem" color="rgba(255,255,255,0.35)">{timeAgo(post.createdAt)}</Typography>
          </Box>
        </Box>
        {user?._id === post.author?._id && (
          <Box display="flex" gap={0.5}>
            <IconButton size="small" onClick={() => setEditing(!editing)} sx={{ color: '#3a86ff', p: 0.5 }}><EditIcon fontSize="small" /></IconButton>
            <IconButton size="small" onClick={handleDelete} sx={{ color: '#e63946', p: 0.5 }}><DeleteIcon fontSize="small" /></IconButton>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box px={2} pb={1.5}>
        {editing ? (
          <Box>
            <TextField fullWidth multiline value={editContent} onChange={(e) => setEditContent(e.target.value)}
              size="small" sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.07)', color: '#fff', '& fieldset': { borderColor: '#3a86ff' } }, '& textarea': { color: '#fff' } }} />
            <Box display="flex" gap={1}>
              <Button size="small" variant="contained" onClick={handleEdit} sx={{ borderRadius: 2, bgcolor: '#3a86ff', fontWeight: 700 }}>Save</Button>
              <Button size="small" onClick={() => setEditing(false)} sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.5)' }}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Typography color="rgba(255,255,255,0.85)" fontSize="0.92rem" lineHeight={1.6} sx={{ whiteSpace: 'pre-wrap' }}>{post.content}</Typography>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
            {post.tags.map(tag => (
              <Chip key={tag} label={`#${tag}`} size="small"
                sx={{ bgcolor: 'rgba(58,134,255,0.1)', color: '#3a86ff', fontSize: '0.65rem', fontWeight: 700, height: 20 }} />
            ))}
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box display="flex" alignItems="center" gap={1} px={1.5} pb={1.5}>
        <IconButton onClick={handleLike} size="small"
          sx={{ color: liked ? '#e63946' : 'rgba(255,255,255,0.4)', '&:hover': { color: '#e63946' }, gap: 0.5 }}>
          {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          <Typography fontSize="0.78rem" color="inherit">{likeCount}</Typography>
        </IconButton>
        <IconButton onClick={() => setShowComments(!showComments)} size="small"
          sx={{ color: showComments ? '#3a86ff' : 'rgba(255,255,255,0.4)', gap: 0.5 }}>
          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography fontSize="0.78rem" color="inherit">{comments.length}</Typography>
        </IconButton>
      </Box>

      {/* Comments */}
      <Collapse in={showComments}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <Box p={2} pt={1.5}>
          {isAuthenticated && (
            <Box component="form" onSubmit={handleComment} display="flex" gap={1} mb={2}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#3a86ff', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <TextField fullWidth placeholder="Write a comment..." value={newComment}
                onChange={(e) => setNewComment(e.target.value)} size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& input': { color: '#fff', py: 0.8, fontSize: '0.82rem' }, '& input::placeholder': { color: 'rgba(255,255,255,0.3)' } }} />
              <IconButton type="submit" size="small" sx={{ bgcolor: '#3a86ff', color: '#fff', borderRadius: 1.5, '&:hover': { bgcolor: '#2563eb' } }}>
                <SendIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
          {comments.map(c => (
            <Box key={c._id} display="flex" gap={1.5} mb={1.5}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#3a86ff', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}
                onClick={() => navigate(`/profile/${c.author?._id}`)} style={{ cursor: 'pointer' }}>
                {c.author?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box flex={1} sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, p: 1.2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize="0.75rem" fontWeight={700} color="#fff">@{c.author?.username}</Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography fontSize="0.68rem" color="rgba(255,255,255,0.3)">{timeAgo(c.createdAt)}</Typography>
                    {user?._id === c.author?._id && (
                      <IconButton size="small" onClick={() => handleDeleteComment(c._id)} sx={{ p: 0.2, color: 'rgba(255,255,255,0.2)', '&:hover': { color: '#e63946' } }}>
                        <DeleteIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Typography fontSize="0.82rem" color="rgba(255,255,255,0.7)">{c.content}</Typography>
              </Box>
            </Box>
          ))}
          {comments.length === 0 && <Typography fontSize="0.78rem" color="rgba(255,255,255,0.3)" textAlign="center">No comments yet</Typography>}
        </Box>
      </Collapse>
    </Box>
  );
}
