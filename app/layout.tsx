import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { WagmiProvider } from '@/components/wagmi-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FrameStore - Farcaster Frame Gallery & Editor',
  description: 'Explore, create, and share Farcaster Frames with our modern gallery and visual editor.',
  keywords: 'Farcaster, Frames, Web3, Crypto, Social, Gallery, Editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WagmiProvider>
            <AuthProvider>
              <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
                <Navigation />
                <main className="relative flex-1">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </div>
            </AuthProvider>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}