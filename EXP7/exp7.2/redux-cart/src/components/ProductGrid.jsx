import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../store/cartSlice';
import { PRODUCTS } from '../store/products';
import {
  Grid, Card, CardContent, Typography, Button, Chip, Box, Badge,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ProductGrid = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const getCartQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3} sx={{ color: '#1a1a2e' }}>
        🛍️ Shop Products
      </Typography>
      <Grid container spacing={3}>
        {PRODUCTS.map((product) => {
          const qty = getCartQty(product.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                elevation={0}
                sx={{
                  border: qty > 0 ? '2px solid #e63946' : '2px solid #f0f0f0',
                  borderRadius: 3,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    borderColor: '#e63946',
                  },
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {qty > 0 && (
                  <Badge
                    badgeContent={qty}
                    color="error"
                    sx={{ position: 'absolute', top: -8, right: -8 }}
                  />
                )}
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography fontSize={48} mb={1}>{product.emoji}</Typography>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ mb: 1.5, fontSize: '0.7rem', bgcolor: '#fff3f3', color: '#e63946' }}
                  />
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#e63946" mb={2}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button
                    fullWidth
                    variant={qty > 0 ? 'outlined' : 'contained'}
                    startIcon={qty > 0 ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
                    onClick={() => dispatch(addToCart(product))}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      bgcolor: qty > 0 ? 'transparent' : '#e63946',
                      borderColor: '#e63946',
                      color: qty > 0 ? '#e63946' : '#fff',
                      '&:hover': {
                        bgcolor: qty > 0 ? '#fff3f3' : '#c1121f',
                        borderColor: '#c1121f',
                      },
                    }}
                  >
                    {qty > 0 ? `In Cart (${qty})` : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
