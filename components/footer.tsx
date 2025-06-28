'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Frame as Frames, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Heart,
  ExternalLink,
  Send,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const FOOTER_LINKS = {
  product: [
    { label: 'Frame Builder', href: '/builder' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Templates', href: '/templates' },
    { label: 'Editor', href: '/editor' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'API Reference', href: '/api' },
  ],
  community: [
    { label: 'Discord', href: 'https://discord.gg/framestore', external: true },
    { label: 'Twitter', href: 'https://twitter.com/framestore_app', external: true },
    { label: 'GitHub', href: 'https://github.com/framestore', external: true },
    { label: 'Farcaster', href: 'https://warpcast.com/framestore', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
  services: [
    { label: 'Custom Development', href: '/hire' },
    { label: 'Consulting', href: '/consulting' },
    { label: 'Enterprise', href: '/enterprise' },
    { label: 'Support', href: '/support' },
  ]
};

const SOCIAL_LINKS = [
  { 
    icon: Twitter, 
    href: 'https://twitter.com/robin_cassard', 
    label: 'Twitter',
    color: 'hover:text-blue-400'
  },
  { 
    icon: Github, 
    href: 'https://github.com/robincassard', 
    label: 'GitHub',
    color: 'hover:text-gray-400'
  },
  { 
    icon: Linkedin, 
    href: 'https://linkedin.com/in/robincassard', 
    label: 'LinkedIn',
    color: 'hover:text-blue-600'
  },
  { 
    icon: Mail, 
    href: 'mailto:robin.cassard@framestore.app', 
    label: 'Email',
    color: 'hover:text-green-500'
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    
    // Simulate newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Subscribed!', {
      description: 'Thank you for subscribing to our newsletter',
    });
    
    setEmail('');
    setIsSubscribing(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Frames className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                FrameStore
              </span>
            </Link>
            
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The ultimate platform for creating, sharing, and discovering Farcaster Frames. 
              Build interactive Web3 experiences with ease.
            </p>

            {/* Creator Info */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Created by</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  RC
                </div>
                <div>
                  <p className="font-semibold">Robin Cassard</p>
                  <p className="text-xs text-muted-foreground">Full-Stack Developer & Web3 Enthusiast</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-muted/50 text-muted-foreground transition-colors ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.community.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on new features and Frame templates.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm"
                required
              />
              <Button 
                type="submit" 
                size="sm" 
                className="w-full gap-2"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Additional Services Section */}
        <Separator className="my-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:robin.cassard@framestore.app" className="hover:text-foreground transition-colors">
                  robin.cassard@framestore.app
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Available worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Remote • France</span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="font-semibold">Built With</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Next.js', 'TypeScript', 'Tailwind CSS', 
                'Supabase', 'Wagmi', 'Framer Motion'
              ].map((tech) => (
                <span 
                  key={tech}
                  className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <p>© {currentYear} FrameStore by Robin Cassard. All rights reserved.</p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4">
              {FOOTER_LINKS.legal.map((link, index) => (
                <div key={link.href} className="flex items-center gap-4">
                  <Link 
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < FOOTER_LINKS.legal.length - 1 && (
                    <span className="text-muted-foreground">•</span>
                  )}
                </div>
              ))}
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-current" />
              <span>for the Farcaster ecosystem</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}