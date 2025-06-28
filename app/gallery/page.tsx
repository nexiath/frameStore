'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedFrameCard } from '@/components/enhanced-frame-card';
import { ArrowLeft, Search, Filter, TrendingUp, Flame, Plus } from 'lucide-react';
import Link from 'next/link';
import { useFrames } from '@/hooks/use-frames';

const FRAME_TYPES = ['All', 'Mint', 'Vote', 'DeFi', 'Poll', 'RSVP', 'Gallery', 'NFT-Mint', 'Signature'];
const PROTOCOLS = ['All', 'Base', 'Ethereum', 'Farcaster'];
const SORT_OPTIONS = ['Latest', 'Popular', 'Trending', 'Most Liked'];

// Transform Supabase frame to match EnhancedFrameCard interface
function transformFrameForGallery(frame: any) {
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
    isVerified: false, // Could be determined by checking if user is in verified list
    isTrending: frame.likes > 5, // Simple trending logic
    created_at: frame.created_at,
    user_id: frame.user_id,
    stats: {
      impressions: Math.max(frame.likes * 15, 100),
      clicks: frame.likes || 0,
      ctr: frame.likes > 0 ? Math.min((frame.likes / Math.max(frame.likes * 15, 100)) * 100, 10) : 0,
      users: Math.max(Math.floor(frame.likes * 0.8), 1)
    }
  };
}

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedProtocol, setSelectedProtocol] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');

  const { frames: supabaseFrames, isLoading, refresh } = useFrames();

  // Transform Supabase frames to match the expected format
  const transformedFrames = supabaseFrames.map(transformFrameForGallery);

  const filteredFrames = transformedFrames.filter(frame => {
    const matchesSearch = frame.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || frame.type === selectedType;
    const matchesProtocol = selectedProtocol === 'All' || frame.protocol === selectedProtocol;
    
    return matchesSearch && matchesType && matchesProtocol;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'Popular':
        return b.interactions - a.interactions;
      case 'Trending':
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      case 'Most Liked':
        return b.interactions - a.interactions;
      default:
        // Latest - sort by created_at
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
    }
  });

  const trendingCount = transformedFrames.filter(frame => frame.isTrending).length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
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
            Back to Home
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Frame Gallery</h1>
          <p className="text-muted-foreground">
            Explore {transformedFrames.length} Farcaster Frames from the community
          </p>
        </div>
        
        <Link href="/builder">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Frame
          </Button>
        </Link>
        
        {/* Trending Indicator */}
        {trendingCount > 0 && (
          <Badge variant="destructive" className="gap-2">
            <Flame className="h-4 w-4" />
            {trendingCount} Trending
          </Badge>
        )}
      </motion.div>

      {/* Search and Filters */}
      <motion.section 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
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

        {/* Filter Controls */}
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
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sort:</span>
            <select
              className="text-sm border rounded px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/2] bg-muted rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFrames.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-muted-foreground text-lg">
              {supabaseFrames.length === 0 
                ? "No frames created yet. Be the first!" 
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
            {filteredFrames.map((frame, index) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              >
                <EnhancedFrameCard frame={frame} onLikeUpdate={refresh} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}