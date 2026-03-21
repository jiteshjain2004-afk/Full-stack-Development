import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const date = new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Card elevation={0} onClick={() => navigate(`/posts/${post._id}`)}
      sx={{
        borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer', transition: 'all 0.2s',
        '&:hover': { transform: 'translateY(-3px)', borderColor: 'rgba(58,134,255,0.4)', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' },
      }}>
      <CardContent sx={{ p: 3 }}>
        {/* Author */}
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#3a86ff', fontSize: '0.8rem', fontWeight: 800 }}>
            {post.author?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontSize="0.82rem" fontWeight={700} color="#fff">{post.author?.username}</Typography>
            <Typography fontSize="0.7rem" color="rgba(255,255,255,0.35)">{date}</Typography>
          </Box>
        </Box>

        {/* Title */}
        <Typography variant="h6" fontWeight={800} color="#fff" mb={1} sx={{
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.title}
        </Typography>

        {/* Excerpt */}
        <Typography fontSize="0.82rem" color="rgba(255,255,255,0.45)" mb={2} sx={{
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.excerpt}
        </Typography>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
            {post.tags.slice(0, 3).map(tag => (
              <Chip key={tag} label={`#${tag}`} size="small"
                sx={{ bgcolor: 'rgba(58,134,255,0.1)', color: '#3a86ff', fontSize: '0.65rem', fontWeight: 700 }} />
            ))}
          </Box>
        )}

        {/* Stats */}
        <Box display="flex" gap={2}>
          {[
            { icon: <FavoriteIcon sx={{ fontSize: 14 }} />, count: post.likes?.length || 0, color: '#e63946' },
            { icon: <VisibilityIcon sx={{ fontSize: 14 }} />, count: post.views || 0, color: 'rgba(255,255,255,0.3)' },
          ].map((s, i) => (
            <Box key={i} display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)">{s.count}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
