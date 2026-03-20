import { useSelector } from 'react-redux';
import { selectCartCount, selectCartTotal } from '../store/cartSlice';
import { AppBar, Toolbar, Typography, Badge, Box, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Navbar = ({ tab, setTab }) => {
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#1a1a2e', borderBottom: '3px solid #e63946' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Brand */}
        <Box display="flex" alignItems="center" gap={1}>
          <StorefrontIcon sx={{ color: '#e63946', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={900} letterSpacing={-0.5}>
            Redux<span style={{ color: '#e63946' }}>Cart</span>
          </Typography>
          <Chip label="Exp 2.3.2" size="small" sx={{ bgcolor: '#e63946', color: '#fff', fontSize: '0.65rem', ml: 1 }} />
        </Box>

        {/* Nav Tabs */}
        <Box display="flex" gap={1}>
          {['shop', 'cart'].map((t) => (
            <Box
              key={t}
              onClick={() => setTab(t)}
              sx={{
                px: 3, py: 1, borderRadius: 2, cursor: 'pointer', fontWeight: 700,
                textTransform: 'capitalize', fontSize: '0.9rem',
                bgcolor: tab === t ? '#e63946' : 'transparent',
                color: '#fff',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: tab === t ? '#c1121f' : 'rgba(255,255,255,0.1)' },
                display: 'flex', alignItems: 'center', gap: 1,
              }}
            >
              {t === 'cart' ? (
                <Badge badgeContent={count} color="warning" max={99}>
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              ) : '🛍️'}
              {t === 'cart' ? 'Cart' : 'Shop'}
              {t === 'cart' && count > 0 && (
                <Chip
                  label={`$${total.toFixed(2)}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
