# 🛒 Duniya Mart - Multi-Vendor Marketplace

A modern, full-stack e-commerce marketplace connecting buyers with local sellers across India. Built with React, TypeScript, and Supabase.

## ✨ Features

### For Buyers
- Browse products from verified sellers
- Advanced search and filtering
- Shopping cart and checkout
- Order tracking and history
- Secure authentication

### For Sellers
- Seller dashboard with analytics
- Product management (add, edit, delete)
- Order management
- Business profile customization
- Sales tracking

### For Admins
- Seller application approval system
- User management
- Platform analytics
- Content moderation

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/jiteshjain2004-afk/Full-stack-Development.git

# Navigate to project directory
cd "Full-stack-Development/capstone project"

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Run development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file with the following:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migrations in order from `supabase/migrations/`
3. Set up Row Level Security policies
4. Configure authentication providers

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📱 Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── integrations/    # Supabase integration
├── lib/             # Utility functions
├── types/           # TypeScript types
└── utils/           # Helper functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Jitesh Jain**
- GitHub: [@jiteshjain2004-afk](https://github.com/jiteshjain2004-afk)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
