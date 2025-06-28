'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Frame as Frames, Smartphone, Code2, Zap } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: Frames,
    title: 'Interactive Frames',
    description: 'Create mini-applications that run directly in Farcaster posts, enabling rich interactions without leaving the feed.'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'All Frames are optimized for mobile viewing, providing seamless experiences on Warpcast and other Farcaster clients.'
  },
  {
    icon: Code2,
    title: 'Easy Integration',
    description: 'Generate standards-compliant Frame JSON with our visual editor - no coding required.'
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Copy your Frame JSON and deploy it instantly to any web server or hosting platform.'
  }
];

const USE_CASES = [
  { title: 'NFT Minting', description: 'Enable users to mint NFTs directly from social posts' },
  { title: 'DAO Voting', description: 'Create governance polls and voting interfaces' },
  { title: 'Token Swaps', description: 'Facilitate DeFi transactions within social feeds' },
  { title: 'Event RSVPs', description: 'Collect event registrations seamlessly' },
  { title: 'Polls & Surveys', description: 'Engage your community with interactive polls' },
  { title: 'Content Gates', description: 'Create token-gated content experiences' }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <motion.div 
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
          About Farcaster Frames
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Farcaster Frames are interactive mini-applications that transform static social media posts 
          into dynamic, actionable experiences within the decentralized social ecosystem.
        </p>
      </motion.section>

      {/* What are Frames */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="text-2xl">What are Farcaster Frames?</CardTitle>
            <CardDescription className="text-base">
              Understanding the revolutionary social media format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Frames are a new standard for interactive content on Farcaster, the decentralized social network. 
              They allow developers to create rich, interactive experiences that users can engage with directly 
              from their social feeds without needing to navigate to external websites.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Think of Frames as mini-apps embedded in social posts - they can display custom images, 
              provide interactive buttons, handle form submissions, and trigger blockchain transactions, 
              all while maintaining the context of social interaction.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Why Use Frames?</h2>
          <p className="text-muted-foreground">Powerful features that enhance social interactions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Popular Use Cases</h2>
          <p className="text-muted-foreground">Endless possibilities for Web3 interactions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
            >
              <h3 className="font-semibold mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Get Started */}
      <motion.section 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription>
              Create your first Frame in minutes with our visual editor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/editor">
                <Button size="lg" className="gap-2">
                  Create Your Frame
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <a href="https://docs.farcaster.xyz/reference/frames/spec" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View Documentation
                </a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <a href="https://warpcast.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Try Warpcast
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}