import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <BlockIcon sx={{ fontSize: 80, color: '#e63946', mb: 2 }} />
      <Typography variant="h4" fontWeight={900} color="#fff" mb={1}>403 — Unauthorized</Typography>
      <Typography color="rgba(255,255,255,0.4)" mb={3}>You don't have permission to access this page.</Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ bgcolor: '#3a86ff', borderRadius: 3, fontWeight: 700 }}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;
