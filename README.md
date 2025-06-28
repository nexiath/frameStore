# 🚀 FrameStore - Farcaster Frame Gallery & Editor

A modern, production-ready platform for creating, sharing, and discovering Farcaster Frames. Built with Next.js, Supabase, and Web3 authentication.

![FrameStore Demo](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 🎨 Frame Creation
- **Visual Editor**: Drag-and-drop interface for creating Frames
- **AI Image Generation**: Generate custom images with AI prompts
- **Live Preview**: Real-time mockup in iPhone interface
- **JSON Export**: Download or copy Frame JSON

### 🔐 Web3 Authentication
- **Wallet Connect**: Sign in with any Ethereum wallet
- **SIWE Integration**: Secure authentication with Sign-In with Ethereum
- **Persistent Sessions**: Stay logged in across browser sessions

### 📊 Analytics & Social
- **Frame Statistics**: Track impressions, clicks, and engagement
- **Like System**: Community-driven popularity ranking
- **Comments**: Discuss and collaborate on Frames
- **Trending**: Discover popular Frames

### 🎯 Professional Tools
- **Dashboard**: Manage all your Frames in one place
- **Embed System**: Integrate Frames into external websites
- **Documentation**: Comprehensive guides and best practices
- **Hire Me Page**: Professional freelance services

## 🛠 Tech Stack

- **Frontend**: Next.js 13 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Web3**: Wagmi v2, Viem, SIWE
- **State Management**: SWR for data fetching
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/framestore.git
cd framestore
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the migration script in the Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Usage Guide

### Creating Your First Frame

1. **Connect Wallet**: Click "Connect Wallet" and sign the message
2. **Open Builder**: Navigate to `/builder` or click "Create Frame"
3. **Configure Frame**: Add title, description, image, and button
4. **Preview**: See live preview in the iPhone mockup
5. **Save**: Click "Save Frame" to store in your dashboard

### Managing Frames

- **Dashboard**: View all your Frames at `/dashboard`
- **Edit**: Modify existing Frames (coming soon)
- **Delete**: Remove Frames you no longer need
- **Analytics**: Track performance and engagement

### Exploring the Gallery

- **Browse**: Discover Frames created by the community
- **Filter**: Sort by type, protocol, or popularity
- **Interact**: Like, comment, and share Frames
- **Embed**: Get embed codes for external websites

## 🏗 Database Schema

### Tables

- **users**: Wallet addresses and user data
- **frames**: Frame content and metadata
- **likes**: User interactions and popularity tracking

### Key Features

- **Row Level Security**: Secure data access
- **Real-time Updates**: Live data synchronization
- **Optimized Queries**: Fast performance with proper indexing

## 🔧 API Reference

### Frame Operations

```typescript
// Create a new Frame
const frame = await saveFrame({
  title: "My Frame",
  description: "Description",
  image_url: "https://...",
  button1_label: "Click Me",
  button1_target: "https://...",
  json_full: frameJSON,
  user_id: userId
});

// Get all Frames
const frames = await getFrames(20, 0);

// Like/Unlike a Frame
const liked = await likeFrame(frameId, userId);
```

### Authentication

```typescript
// Sign in with wallet
const { authState, signIn, signOut } = useAuth();

// Check authentication status
if (authState.isAuthenticated) {
  // User is signed in
  console.log(authState.user.wallet_address);
}
```

## 🎨 Customization

### Styling

The app uses Tailwind CSS with a custom design system:

- **Colors**: Primary purple gradient, semantic colors
- **Typography**: Inter font family
- **Components**: shadcn/ui with custom styling
- **Dark Mode**: Full support with theme toggle

### Adding Features

1. **New Frame Types**: Extend the Frame schema
2. **Custom Analytics**: Add tracking events
3. **Social Features**: Implement sharing and collaboration
4. **Payment Integration**: Add premium features

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- **Netlify**: Static export with serverless functions
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Farcaster**: For the innovative Frame protocol
- **Supabase**: For the excellent backend platform
- **shadcn/ui**: For the beautiful UI components
- **Vercel**: For the seamless deployment experience

## 📞 Support

- **Documentation**: [docs.framestore.app](https://docs.framestore.app)
- **Discord**: [Join our community](https://discord.gg/framestore)
- **Email**: support@framestore.app
- **Twitter**: [@framestore_app](https://twitter.com/framestore_app)

---

Built with ❤️ for the Farcaster ecosystem# frameStore
