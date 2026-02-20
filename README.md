<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gorgeous Websites

A stunning, modern web application showcasing beautiful UI/UX design with animated components, card scanner effects, and integrated user authentication.

## Features

- 🎨 **Beautiful UI/UX** - Premium design with glassmorphism, gradients, and smooth animations
- 🎯 **Card Scanner Effect** - Animated card scanning visualization
- 🔐 **User Authentication** - Supabase-powered auth with personalized dashboards
- 📊 **User Dashboard** - Track goals, income, and clients
- ⚡ **Performance Optimized** - Built with React, TypeScript, and Vite

## Run Locally

**Prerequisites:** Node.js 16+

1. **Clone the repository**
   ```bash
   git clone https://github.com/ItsssssJack/Gorgeous-websites.-.git
   cd Gorgeous-websites.-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your credentials:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `GEMINI_API_KEY` (optional) - For AI features

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ItsssssJack/Gorgeous-websites.-)

1. Click the "Deploy" button above or go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (optional)
4. Deploy!

## Supabase Setup

To use the authentication features, you'll need to set up Supabase:

1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Run these SQL commands in the Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_dashboard table
CREATE TABLE user_dashboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal TEXT,
  income NUMERIC,
  clients INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboard ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - improve for production)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own dashboard" ON user_dashboard
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own dashboard" ON user_dashboard
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own dashboard" ON user_dashboard
  FOR UPDATE USING (true);
```

4. Copy your project URL and anon key to `.env.local`

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Supabase** - Backend & Auth
- **Tailwind CSS** - Styling (via inline styles)
- **Lucide React** - Icons

## License

MIT

---

Built with ❤️ using cutting-edge web technologies

