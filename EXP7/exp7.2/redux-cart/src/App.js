import { useState } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';

function App() {
  const [tab, setTab] = useState('shop');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Navbar tab={tab} setTab={setTab} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {tab === 'shop' ? <ProductGrid /> : <Cart />}
      </Container>
    </Box>
  );
}

export default App;
