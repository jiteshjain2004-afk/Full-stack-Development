import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart, updateQuantity, clearCart,
  selectCartItems, selectCartTotal,
} from '../store/cartSlice';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Divider, Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <ShoppingCartIcon sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" fontWeight={600}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Go to the Shop tab and add some products!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#1a1a2e' }}>
          🛒 Cart
          <Chip
            label={`${items.length} item${items.length > 1 ? 's' : ''}`}
            size="small"
            sx={{ ml: 2, bgcolor: '#e63946', color: '#fff', fontWeight: 700 }}
          />
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={() => dispatch(clearCart())}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Clear All
        </Button>
      </Box>

      {/* Persist notice */}
      <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
        🔒 Cart is persisted to <strong>localStorage</strong> — your items will remain after page refresh!
      </Alert>

      {/* Cart Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              {['Product', 'Price', 'Quantity', 'Subtotal', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a1a2e' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:hover': { bgcolor: '#fff8f8' }, transition: 'background 0.2s' }}
              >
                {/* Product */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography fontSize={28}>{item.emoji}</Typography>
                    <Box>
                      <Typography fontWeight={700}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.category}</Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Price */}
                <TableCell>
                  <Typography fontWeight={600} color="#e63946">
                    ${item.price.toFixed(2)}
                  </Typography>
                </TableCell>

                {/* Quantity */}
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) || 1 }))
                    }
                    inputProps={{ min: 1, style: { textAlign: 'center', fontWeight: 700 } }}
                    sx={{ width: 80 }}
                  />
                </TableCell>

                {/* Subtotal */}
                <TableCell>
                  <Typography fontWeight={800} fontSize="1.05rem">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </TableCell>

                {/* Remove */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => dispatch(removeFromCart(item.id))}
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total */}
      <Divider sx={{ my: 3 }} />
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={3}>
        <Typography variant="h6" color="text.secondary" fontWeight={600}>
          Total:
        </Typography>
        <Typography variant="h4" fontWeight={900} color="#e63946">
          ${total.toFixed(2)}
        </Typography>
      </Box>

      {/* Checkout Button */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#e63946', borderRadius: 3, fontWeight: 800,
            px: 5, fontSize: '1rem',
            '&:hover': { bgcolor: '#c1121f' },
          }}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
