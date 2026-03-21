import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Avatar, Chip, CircularProgress, Alert, Grid, Divider, Fade,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

// ── FEED PAGE ─────────────────────────────────────────────────
export function FeedPage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const endpoint = isAuthenticated ? '/posts/feed' : '/posts';
        const res = await api.get(endpoint);
        setPosts(res.data.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [isAuthenticated]);

  const handleCreated = (post) => setPosts(prev => [{ ...post, comments: [] }, ...prev]);
  const handleUpdate  = (post) => setPosts(prev => prev.map(p => p._id === post._id ? { ...post, comments: p.comments } : p));
  const handleDelete  = (id)   => setPosts(prev => prev.filter(p => p._id !== id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', py: 3, px: 2 }}>
      <Box maxWidth={600} mx="auto">
        {!isAuthenticated && (
          <Box sx={{ bgcolor: 'rgba(58,134,255,0.08)', border: '1px solid rgba(58,134,255,0.2)', borderRadius: 3, p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={900} color="#fff" mb={1}>Welcome to SocialHub 🌐</Typography>
            <Typography color="rgba(255,255,255,0.5)" mb={2} fontSize="0.9rem">Connect, share, and explore with others</Typography>
            <Box display="flex" gap={1.5} justifyContent="center">
              <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: 3, bgcolor: '#3a86ff', fontWeight: 700 }}>Get Started</Button>
              <Button component={Link} to="/login" variant="outlined" sx={{ borderRadius: 3, borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Sign In</Button>
            </Box>
          </Box>
        )}

        {isAuthenticated && <CreatePost onCreated={handleCreated} />}

        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress sx={{ color: '#3a86ff' }} /></Box>
        ) : posts.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="rgba(255,255,255,0.3)">No posts yet. Follow some users or create your first post!</Typography>
          </Box>
        ) : (
          posts.map(post => (
            <PostCard key={post._id} post={post} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))
        )}
      </Box>
    </Box>
  );
}

// ── EXPLORE PAGE ──────────────────────────────────────────────
export function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initSearch = searchParams.get('search') || '';
  const [users,   setUsers]   = useState([]);
  const [posts,   setPosts]   = useState([]);
  const [search,  setSearch]  = useState(initSearch);
  const [tab,     setTab]     = useState('posts');
  const [loading, setLoading] = useState(false);
  const { user: me, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [uRes, pRes] = await Promise.all([
          api.get('/users', { params: search ? { search } : {} }),
          api.get('/posts', { params: search ? { search } : {} }),
        ]);
        setUsers(uRes.data.data); setPosts(pRes.data.data);
      } finally { setLoading(false); }
    };
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleUpdate = (post) => setPosts(prev => prev.map(p => p._id === post._id ? { ...post, comments: p.comments } : p));
  const handleDelete = (id)   => setPosts(prev => prev.filter(p => p._id !== id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', py: 3, px: 2 }}>
      <Box maxWidth={700} mx="auto">
        <Typography variant="h5" fontWeight={900} color="#fff" mb={2}>🔍 Explore</Typography>
        <TextField fullWidth placeholder="Search users and posts..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.3)' }} /></InputAdornment> }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& input': { color: '#fff' } }} />

        <Box display="flex" gap={1} mb={3}>
          {['posts', 'users'].map(t => (
            <Chip key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} onClick={() => setTab(t)}
              sx={{ bgcolor: tab === t ? '#3a86ff' : 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }} />
          ))}
        </Box>

        {loading ? <Box textAlign="center" py={5}><CircularProgress sx={{ color: '#3a86ff' }} /></Box> : (
          <>
            {tab === 'posts' && posts.map(post => (
              <PostCard key={post._id} post={post} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))}
            {tab === 'users' && (
              <Grid container spacing={2}>
                {users.filter(u => u._id !== me?._id).map(u => (
                  <Grid item xs={12} sm={6} key={u._id}>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', p: 2.5, cursor: 'pointer', '&:hover': { borderColor: 'rgba(58,134,255,0.3)' } }}
                      onClick={() => navigate(`/profile/${u._id}`)}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 44, height: 44, bgcolor: '#3a86ff', fontWeight: 800 }}>{u.username?.[0]?.toUpperCase()}</Avatar>
                        <Box>
                          <Typography fontWeight={700} color="#fff">@{u.username}</Typography>
                          {u.bio && <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)" noWrap>{u.bio}</Typography>}
                          <Typography fontSize="0.7rem" color="rgba(255,255,255,0.3)">{u.followers?.length || 0} followers</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────
export function ProfilePage() {
  const { id } = useParams();
  const { user: me, isAuthenticated, updateUser } = useAuth();
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [following, setFollowing] = useState(false);
  const [editMode,  setEditMode]  = useState(false);
  const [bio,       setBio]       = useState('');
  const isOwnProfile = me?._id === id;

  useEffect(() => {
    api.get(`/users/${id}`).then(res => {
      setData(res.data.data);
      setBio(res.data.data.user.bio || '');
      setFollowing(res.data.data.user.followers?.some(f => f._id === me?._id || f === me?._id));
    }).finally(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    const res = await api.patch(`/users/${id}/follow`);
    setFollowing(res.data.following);
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        followers: res.data.following
          ? [...(prev.user.followers || []), { _id: me._id }]
          : (prev.user.followers || []).filter(f => (f._id || f) !== me._id),
      },
    }));
  };

  const handleSaveBio = async () => {
    const res = await api.put('/auth/profile', { bio });
    updateUser(res.data.user);
    setData(prev => ({ ...prev, user: { ...prev.user, bio } }));
    setEditMode(false);
  };

  const handleUpdate = (post) => setData(prev => ({ ...prev, posts: prev.posts.map(p => p._id === post._id ? post : p) }));
  const handleDelete = (postId) => setData(prev => ({ ...prev, posts: prev.posts.filter(p => p._id !== postId) }));

  if (loading) return <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#3a86ff' }} /></Box>;
  if (!data)   return null;

  const { user, posts } = data;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', py: 3, px: 2 }}>
      <Box maxWidth={600} mx="auto">
        {/* Profile Card */}
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', p: 3, mb: 3 }}>
          <Box display="flex" alignItems="flex-start" gap={2.5} flexWrap="wrap">
            <Avatar sx={{ width: 68, height: 68, bgcolor: '#3a86ff', fontSize: '1.6rem', fontWeight: 900, flexShrink: 0 }}>
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap" mb={0.5}>
                <Typography variant="h6" fontWeight={900} color="#fff">@{user.username}</Typography>
                {isAuthenticated && !isOwnProfile && (
                  <Button size="small" variant={following ? 'outlined' : 'contained'}
                    startIcon={following ? <PersonRemoveIcon /> : <PersonAddIcon />}
                    onClick={handleFollow}
                    sx={{ borderRadius: 2, fontWeight: 700, bgcolor: following ? 'transparent' : '#3a86ff', borderColor: following ? 'rgba(255,255,255,0.2)' : 'transparent', color: following ? 'rgba(255,255,255,0.6)' : '#fff', '&:hover': { bgcolor: following ? 'rgba(255,255,255,0.05)' : '#2563eb' } }}>
                    {following ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
                {isOwnProfile && (
                  <Button size="small" onClick={() => setEditMode(!editMode)}
                    sx={{ borderRadius: 2, fontWeight: 600, color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {editMode ? 'Cancel' : 'Edit Bio'}
                  </Button>
                )}
              </Box>

              {editMode ? (
                <Box>
                  <TextField fullWidth size="small" value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="Write your bio..." multiline rows={2}
                    sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(255,255,255,0.07)', color: '#fff', '& fieldset': { borderColor: '#3a86ff' } }, '& textarea': { color: '#fff', fontSize: '0.85rem' } }} />
                  <Button size="small" variant="contained" onClick={handleSaveBio}
                    sx={{ borderRadius: 2, bgcolor: '#3a86ff', fontWeight: 700 }}>Save</Button>
                </Box>
              ) : (
                user.bio && <Typography color="rgba(255,255,255,0.55)" fontSize="0.88rem" mb={1.5}>{user.bio}</Typography>
              )}

              <Box display="flex" gap={2}>
                {[
                  { label: 'Posts',     value: posts.length },
                  { label: 'Followers', value: user.followers?.length || 0 },
                  { label: 'Following', value: user.following?.length || 0 },
                ].map(s => (
                  <Box key={s.label} textAlign="center">
                    <Typography fontWeight={800} color="#fff" fontSize="1rem">{s.value}</Typography>
                    <Typography fontSize="0.72rem" color="rgba(255,255,255,0.4)">{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.72rem" textTransform="uppercase" letterSpacing={1} mb={2}>
          Posts
        </Typography>
        {posts.length === 0 ? (
          <Typography color="rgba(255,255,255,0.3)" textAlign="center" py={4}>No posts yet.</Typography>
        ) : (
          posts.map(post => (
            <PostCard key={post._id} post={{ ...post, author: user }} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))
        )}
      </Box>
    </Box>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────
export function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

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
            <Typography color="rgba(255,255,255,0.4)" textAlign="center" mb={3} fontSize="0.88rem">Sign in to SocialHub</Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ ...fSx, mb: 2 }} />
              <TextField fullWidth label="Password" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} sx={fSx} />
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
  const [error,   setError]   = useState('');

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
            <Typography variant="h4" fontWeight={900} color="#fff" textAlign="center" mb={0.5}>Join SocialHub</Typography>
            <Typography color="rgba(255,255,255,0.4)" textAlign="center" mb={3} fontSize="0.88rem">Create your account</Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Username', key: 'username', type: 'text' },
                { label: 'Email',    key: 'email',    type: 'email' },
                { label: 'Password', key: 'password', type: 'password' },
              ].map(f => (
                <TextField key={f.key} fullWidth label={f.label} type={f.type}
                  value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  sx={{ ...fSx, mb: 2 }} />
              ))}
              <TextField fullWidth label="Bio (optional)" multiline rows={2}
                value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} sx={fSx} />
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

const fSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' }, '&.Mui-focused fieldset': { borderColor: '#3a86ff' } },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3a86ff' },
  '& input, & textarea': { color: '#fff' },
  '& input::placeholder, & textarea::placeholder': { color: 'rgba(255,255,255,0.3)' },
};
