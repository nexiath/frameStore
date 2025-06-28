'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FrameCard } from '@/components/frame-card';
import { Search, Plus, Filter, Sparkles, GalleryVertical, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFrames } from '@/hooks/use-frames';

const FRAME_TYPES = ['All', 'Mint', 'Vote', 'DeFi', 'Poll', 'RSVP', 'Gallery', 'NFT-Mint', 'Signature'];
const PROTOCOLS = ['All', 'Base', 'Ethereum', 'Farcaster'];

// Transform Supabase frame to match FrameCard interface
function transformFrame(frame: any) {
  return {
    id: frame.id,
    title: frame.title,
    author: frame.user?.wallet_address ? 
      `${frame.user.wallet_address.slice(0, 6)}...${frame.user.wallet_address.slice(-4)}` : 
      'Anonymous',
    type: frame.json_full?.type || 'Frame',
    image: frame.image_url,
    description: frame.description,
    interactions: frame.likes || 0,
    protocol: frame.json_full?.protocol || 'Farcaster',
    created_at: frame.created_at,
    user_id: frame.user_id
  };
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedProtocol, setSelectedProtocol] = useState('All');
  
  const { frames: supabaseFrames, isLoading, refresh } = useFrames();

  // Transform Supabase frames to match the expected format
  const transformedFrames = supabaseFrames.map(transformFrame);

  const filteredFrames = transformedFrames.filter(frame => {
    const matchesSearch = frame.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || frame.type === selectedType;
    const matchesProtocol = selectedProtocol === 'All' || frame.protocol === selectedProtocol;
    
    return matchesSearch && matchesType && matchesProtocol;
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            FrameStore
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Explore top Farcaster Frames and create your own interactive experiences 
          that seamlessly integrate with the Web3 social ecosystem.
        </motion.p>
        
        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/builder">
            <Button size="lg" className="gap-2">
              <Wrench className="h-5 w-5" />
              Frame Builder
            </Button>
          </Link>
          <Link href="/editor">
            <Button variant="outline" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Advanced Editor
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" size="lg" className="gap-2">
              <GalleryVertical className="h-5 w-5" />
              Browse Gallery
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Type:</span>
            <div className="flex flex-wrap gap-1">
              {FRAME_TYPES.map(type => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "secondary"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Protocol:</span>
            <div className="flex flex-wrap gap-1">
              {PROTOCOLS.map(protocol => (
                <Badge
                  key={protocol}
                  variant={selectedProtocol === protocol ? "default" : "secondary"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedProtocol(protocol)}
                >
                  {protocol}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Frames */}
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Featured Frames {!isLoading && `(${filteredFrames.length})`}
          </h2>
          <Link href="/gallery">
            <Button variant="outline" size="sm" className="gap-2">
              <GalleryVertical className="h-4 w-4" />
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/2] bg-muted rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFrames.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <p className="text-muted-foreground text-lg">
              {supabaseFrames.length === 0 
                ? "No frames created yet. Be the first to create one!" 
                : "No frames found matching your criteria."
              }
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {supabaseFrames.length === 0 
                ? "Start building amazing Farcaster Frames today." 
                : "Try adjusting your search or filters."
              }
            </p>
            {supabaseFrames.length === 0 && (
              <Link href="/builder">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Frame
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrames.slice(0, 6).map((frame, index) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              >
                <FrameCard frame={frame} onLikeUpdate={refresh} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}