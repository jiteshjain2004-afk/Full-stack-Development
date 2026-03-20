require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');

const SEED_USERS = [
  { username: 'admin',     email: 'admin@rbac.com',     password: 'admin123',     role: 'admin'     },
  { username: 'moderator', email: 'mod@rbac.com',       password: 'mod123',       role: 'moderator' },
  { username: 'alice',     email: 'alice@rbac.com',     password: 'alice123',     role: 'user'      },
  { username: 'bob',       email: 'bob@rbac.com',       password: 'bob123',       role: 'user'      },
  { username: 'jitesh',    email: 'jitesh@rbac.com',    password: 'jitesh123',    role: 'user'      },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await User.deleteMany({});
  for (const u of SEED_USERS) {
    await User.create(u);
    console.log(`Created: ${u.username} (${u.role})`);
  }
  console.log('✅ Seeded successfully!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
