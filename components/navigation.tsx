'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { WalletConnect } from '@/components/wallet-connect';
import { NotificationsPanel } from '@/components/notifications-panel';
import { useNotifications } from '@/hooks/use-notifications';
import { 
  Frame as Frames, 
  Plus, 
  Info, 
  GalleryVertical, 
  Wrench, 
  BookOpen, 
  Briefcase, 
  LayoutDashboard,
  Bell,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Frames },
  { href: '/gallery', label: 'Gallery', icon: GalleryVertical },
  { href: '/builder', label: 'Builder', icon: Wrench },
  { href: '/editor', label: 'Editor', icon: Plus },
  { href: '/templates', label: 'Templates', icon: Sparkles },
  { href: '/docs', label: 'Docs', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info },
  { href: '/hire', label: 'Hire Me', icon: Briefcase },
];

export function Navigation() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();

  const navItems = [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, ...NAV_ITEMS];

  return (
    <>
      <motion.nav 
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Frames className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                FrameStore
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 transition-all",
                        isActive && "shadow-sm"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Navigation + Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Navigation */}
              <div className="lg:hidden flex items-center gap-1">
                {navItems.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="p-2"
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                  );
                })}
              </div>
              
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
              
              {/* Wallet Connect */}
              <div className="hidden md:block">
                <WalletConnect />
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
}