import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Avatar, Chip, CircularProgress, Alert, Divider, Grid,
  IconButton, Fade, InputAdornment,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PostCard from '../components/PostCard';

// ── HOME PAGE ─────────────────────────────────────────────────
export function HomePage() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tag, setTag]       = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (tag)    params.tag    = tag;
        const res = await api.get('/posts', { params });
        setPosts(res.data.data);
      } catch {} finally { setLoading(false); }
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, tag]);

  const allTags = [...new Set(posts.flatMap(p => p.tags || []))].slice(0, 10);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 } }}>
      <Box maxWidth={900} mx="auto">
        <Box textAlign="center" mb={5} mt={2}>
          <Typography variant="h3" fontWeight={900} color="#fff" letterSpacing={-1} mb={1}>
            Latest <span style={{ color: '#3a86ff' }}>Posts</span>
          </Typography>
          <Typography color="rgba(255,255,255,0.4)">Discover stories and ideas from our community</Typography>
        </Box>

        {/* Search */}
        <TextField fullWidth placeholder="Search posts..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.3)' }} /></InputAdornment> }}
          sx={{ mb: 2, ...darkField }} />

        {/* Tag filters */}
        {allTags.length > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
            <Chip label="All" onClick={() => setTag('')} size="small"
              sx={{ bgcolor: !tag ? '#3a86ff' : 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 700, cursor: 'pointer' }} />
            {allTags.map(t => (
              <Chip key={t} label={`#${t}`} onClick={() => setTag(t === tag ? '' : t)} size="small"
                sx={{ bgcolor: tag === t ? 'rgba(58,134,255,0.2)' : 'rgba(255,255,255,0.06)', color: tag === t ? '#3a86ff' : 'rgba(255,255,255,0.5)', fontWeight: 700, cursor: 'pointer' }} />
            ))}
          </Box>
        )}

        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress sx={{ color: '#3a86ff' }} /></Box>
        ) : posts.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="rgba(255,255,255,0.3)" variant="h6">No posts yet. Be the first to write!</Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {posts.map(post => (
              <Grid item xs={12} sm={6} key={post._id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────
export function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setError(err.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Fade in timeout={400}>
        <Card elevation={0} sx={{ width: '100%', maxWidth: 420, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Typography variant="h4" fontWeight={900} color="#fff" textAlign="center" mb={0.5}>Welcome back</Typography>
            <Typography color="rgba(255,255,255,0.4)" textAlign="center" mb={3} fontSize="0.88rem">Sign in to BlogHub</Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ ...darkField, mb: 2 }} />
              <TextField fullWidth label="Password" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} sx={darkField} />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{ mt: 3, borderRadius: 3, fontWeight: 800, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' }, py: 1.5 }}>
                {loading ? <CircularProgress size={22} sx={{ color: 'rgba(255,255,255,0.7)' }} /> : 'Sign In'}
              </Button>
            </form>
            <Typography textAlign="center" mt={2.5} fontSize="0.85rem" color="rgba(255,255,255,0.4)">
              No account? <Link to="/register" style={{ color: '#3a86ff', fontWeight: 700 }}>Sign up</Link>
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}

// ── REGISTER PAGE ─────────────────────────────────────────────
export function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ username: '', email: '', password: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form); navigate('/'); }
    catch (err) { setError(err.response?.data?.error || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Fade in timeout={400}>
        <Card elevation={0} sx={{ width: '100%', maxWidth: 440, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Typography variant="h4" fontWeight={900} color="#fff" textAlign="center" mb={0.5}>Join BlogHub</Typography>
            <Typography color="rgba(255,255,255,0.4)" textAlign="center" mb={3} fontSize="0.88rem">Create your account</Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Username', key: 'username', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Password', key: 'password', type: 'password' },
              ].map(f => (
                <TextField key={f.key} fullWidth label={f.label} type={f.type}
                  value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  sx={{ ...darkField, mb: 2 }} />
              ))}
              <TextField fullWidth label="Bio (optional)" multiline rows={2}
                value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                sx={darkField} />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{ mt: 3, borderRadius: 3, fontWeight: 800, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' }, py: 1.5 }}>
                {loading ? <CircularProgress size={22} sx={{ color: 'rgba(255,255,255,0.7)' }} /> : 'Create Account'}
              </Button>
            </form>
            <Typography textAlign="center" mt={2.5} fontSize="0.85rem" color="rgba(255,255,255,0.4)">
              Have account? <Link to="/login" style={{ color: '#3a86ff', fontWeight: 700 }}>Sign in</Link>
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}

// ── POST DETAIL PAGE ──────────────────────────────────────────
export function PostDetailPage() {
  const { id }      = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate    = useNavigate();
  const [post, setPost]       = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked]           = useState(false);
  const [likeCount, setLikeCount]   = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data);
        setComments(res.data.data.comments || []);
        setLikeCount(res.data.data.likes?.length || 0);
        setLiked(res.data.data.likes?.includes(user?._id));
      } catch { navigate('/'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const res = await api.patch(`/posts/${id}/like`);
    setLiked(res.data.liked);
    setLikeCount(res.data.likes);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/comments', { content: newComment, postId: id });
      setComments(prev => [res.data.data, ...prev]);
      setNewComment('');
    } finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    setComments(prev => prev.filter(c => c._id !== commentId));
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    navigate('/');
  };

  if (loading) return <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#3a86ff' }} /></Box>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', py: 4, px: 2 }}>
      <Box maxWidth={760} mx="auto">
        {/* Tags */}
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          {post.tags?.map(tag => (
            <Chip key={tag} label={`#${tag}`} size="small"
              sx={{ bgcolor: 'rgba(58,134,255,0.1)', color: '#3a86ff', fontWeight: 700 }} />
          ))}
        </Box>

        {/* Title */}
        <Typography variant="h3" fontWeight={900} color="#fff" mb={3} letterSpacing={-1}>{post.title}</Typography>

        {/* Author bar */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${post.author?._id}`)}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: '#3a86ff', fontWeight: 800 }}>
              {post.author?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography fontWeight={700} color="#fff">{post.author?.username}</Typography>
              <Typography fontSize="0.72rem" color="rgba(255,255,255,0.35)">
                {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                &nbsp;·&nbsp;{post.views} views
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />} onClick={handleLike}
              sx={{ borderRadius: 2, color: liked ? '#e63946' : 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: liked ? 'rgba(230,57,70,0.3)' : 'rgba(255,255,255,0.1)' }}>
              {likeCount}
            </Button>
            {user?._id === post.author?._id && (
              <>
                <IconButton onClick={() => navigate(`/posts/${id}/edit`)} size="small" sx={{ color: '#3a86ff' }}><EditIcon /></IconButton>
                <IconButton onClick={handleDeletePost} size="small" sx={{ color: '#e63946' }}><DeleteIcon /></IconButton>
              </>
            )}
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, p: 4, border: '1px solid rgba(255,255,255,0.07)', mb: 4 }}>
          <Typography color="rgba(255,255,255,0.8)" fontSize="1rem" lineHeight={2} sx={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 4 }} />

        {/* Comments */}
        <Typography variant="h6" fontWeight={800} color="#fff" mb={3}>
          💬 Comments ({comments.length})
        </Typography>

        {isAuthenticated && (
          <Box component="form" onSubmit={handleComment} display="flex" gap={1.5} mb={3}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#3a86ff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <TextField fullWidth multiline maxRows={3} placeholder="Write a comment..."
              value={newComment} onChange={(e) => setNewComment(e.target.value)} size="small"
              sx={darkField} />
            <IconButton type="submit" disabled={submitting || !newComment.trim()}
              sx={{ bgcolor: '#3a86ff', color: '#fff', borderRadius: 2, flexShrink: 0, '&:hover': { bgcolor: '#2563eb' }, '&:disabled': { bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' } }}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {comments.map(comment => (
          <Fade in key={comment._id}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#3a86ff', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                {comment.author?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box flex={1} sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2.5, p: 2, border: '1px solid rgba(255,255,255,0.07)' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography fontWeight={700} color="#fff" fontSize="0.85rem">{comment.author?.username}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize="0.7rem" color="rgba(255,255,255,0.3)">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                    {user?._id === comment.author?._id && (
                      <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}
                        sx={{ color: 'rgba(255,255,255,0.2)', p: 0.3, '&:hover': { color: '#e63946' } }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Typography fontSize="0.85rem" color="rgba(255,255,255,0.7)">{comment.content}</Typography>
              </Box>
            </Box>
          </Fade>
        ))}

        {!isAuthenticated && (
          <Box sx={{ bgcolor: 'rgba(58,134,255,0.07)', border: '1px solid rgba(58,134,255,0.2)', borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography color="rgba(255,255,255,0.5)" fontSize="0.88rem">
              <Link to="/login" style={{ color: '#3a86ff', fontWeight: 700 }}>Sign in</Link> to leave a comment
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── NEW / EDIT POST PAGE ──────────────────────────────────────
export function PostFormPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = !!id;
  const [form, setForm]     = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/posts/${id}`).then(res => {
        const p = res.data.data;
        setForm({ title: p.title, content: p.content, tags: p.tags?.join(', ') || '' });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (isEdit) { await api.put(`/posts/${id}`, payload); navigate(`/posts/${id}`); }
      else { const res = await api.post('/posts', payload); navigate(`/posts/${res.data.data._id}`); }
    } catch (err) { setError(err.response?.data?.error || 'Failed to save post'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', py: 4, px: 2 }}>
      <Box maxWidth={760} mx="auto">
        <Typography variant="h4" fontWeight={900} color="#fff" mb={4}>{isEdit ? '✏️ Edit Post' : '✍️ Write a Post'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ ...darkField, mb: 2 }} />
          <TextField fullWidth multiline rows={14} label="Content"
            value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your story..." sx={{ ...darkField, mb: 2 }} />
          <TextField fullWidth label="Tags (comma separated)" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="react, javascript, webdev" sx={{ ...darkField, mb: 3 }} />
          <Box display="flex" gap={2}>
            <Button type="submit" variant="contained" size="large" disabled={loading}
              sx={{ borderRadius: 3, fontWeight: 800, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' }, px: 4 }}>
              {loading ? <CircularProgress size={22} sx={{ color: 'rgba(255,255,255,0.7)' }} /> : isEdit ? 'Update Post' : 'Publish Post'}
            </Button>
            <Button onClick={() => navigate(-1)} variant="outlined"
              sx={{ borderRadius: 3, borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────
export function ProfilePage() {
  const { id }   = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#3a86ff' }} /></Box>;
  if (!data) return null;

  const { user, posts } = data;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', py: 4, px: 2 }}>
      <Box maxWidth={800} mx="auto">
        {/* Profile header */}
        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', mb: 4 }}>
          <CardContent sx={{ p: 4, display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#3a86ff', fontSize: '1.8rem', fontWeight: 900, flexShrink: 0 }}>
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={900} color="#fff">{user.username}</Typography>
              <Typography color="rgba(255,255,255,0.4)" fontSize="0.85rem" mb={1}>{user.email}</Typography>
              {user.bio && <Typography color="rgba(255,255,255,0.6)" fontSize="0.9rem">{user.bio}</Typography>}
              <Box display="flex" gap={2} mt={2}>
                <Chip label={`${posts.length} Posts`} size="small" sx={{ bgcolor: 'rgba(58,134,255,0.12)', color: '#3a86ff', fontWeight: 700 }} />
                <Chip label={`Joined ${new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`} size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight={800} color="#fff" mb={2}>Posts by {user.username}</Typography>
        {posts.length === 0 ? (
          <Typography color="rgba(255,255,255,0.3)">No posts yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {posts.map(post => (
              <Grid item xs={12} sm={6} key={post._id}>
                <PostCard post={{ ...post, author: user }} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

// ── SHARED STYLES ─────────────────────────────────────────────
const darkField = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: '#3a86ff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3a86ff' },
  '& input, & textarea': { color: '#fff' },
  '& input::placeholder, & textarea::placeholder': { color: 'rgba(255,255,255,0.3)' },
};
