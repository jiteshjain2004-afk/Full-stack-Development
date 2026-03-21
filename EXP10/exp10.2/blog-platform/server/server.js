require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/posts',    require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users',    require('./routes/users'));

app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Blog server running', timestamp: new Date() })
);

app.use((req, res) => res.status(404).json({ error: `Route ${req.originalUrl} not found` }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Blog server on http://localhost:${PORT}`));
  })
  .catch((err) => { console.error('❌', err.message); process.exit(1); });
