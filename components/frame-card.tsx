'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FramePreviewModal } from '@/components/frame-preview-modal';
import { useFramePreview } from '@/hooks/use-frame-preview';
import { useFrameActions } from '@/hooks/use-frames';
import { useAuth } from '@/hooks/use-auth';
import { Copy, Eye, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Frame {
  id: string;
  title: string;
  author: string;
  type: string;
  image: string;
  description: string;
  interactions: number;
  protocol: string;
  created_at?: string;
  user_id?: string;
}

interface FrameCardProps {
  frame: Frame;
  onLikeUpdate?: () => void;
}

export function FrameCard({ frame, onLikeUpdate }: FrameCardProps) {
  const { isPreviewOpen, previewData, previewJson, openPreview, closePreview } = useFramePreview();
  const { toggleLike } = useFrameActions();
  const { authState } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(frame.interactions);

  const handleCopyJSON = () => {
    // Mock JSON for demonstration
    const mockJSON = {
      "fc:frame": "vNext",
      "fc:frame:image": frame.image,
      "fc:frame:button:1": "Interact",
      "fc:frame:post_url": "https://api.example.com/frame",
      "og:title": frame.title,
      "og:description": frame.description,
      "og:image": frame.image
    };

    const jsonString = JSON.stringify(mockJSON, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast.success('Frame JSON copied to clipboard!');
  };

  const handlePreview = () => {
    const frameData = {
      id: frame.id,
      title: frame.title,
      description: frame.description,
      image_url: frame.image,
      button1_label: 'Interact',
      button1_target: 'https://example.com',
    };

    const frameJson = JSON.stringify({
      "fc:frame": "vNext",
      "fc:frame:image": frame.image,
      "fc:frame:button:1": "Interact",
      "fc:frame:post_url": "https://api.example.com/frame",
      "og:title": frame.title,
      "og:description": frame.description,
      "og:image": frame.image
    }, null, 2);

    openPreview(frameData, frameJson);
  };

  const handleLike = async () => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to like frames');
      return;
    }

    setIsLiking(true);
    try {
      const liked = await toggleLike(frame.id);
      setCurrentLikes(prev => liked ? prev + 1 : prev - 1);
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    } catch (error) {
      console.error('Error liking frame:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          {/* Image */}
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src={frame.image}
              alt={frame.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Overlay Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" onClick={handlePreview} className="flex-1 gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button size="sm" variant="secondary" onClick={handleCopyJSON} className="flex-1 gap-2">
                <Copy className="h-4 w-4" />
                Copy JSON
              </Button>
            </div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{frame.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {frame.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground truncate">{frame.author}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(frame.created_at)}
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <Badge variant="secondary" className="text-xs">
                  {frame.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {frame.protocol}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-0">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {frame.description}
            </p>
          </CardContent>

          <CardFooter className="pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`gap-1 h-8 px-2 ${authState.isAuthenticated ? 'hover:text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isLiking ? 'animate-pulse' : ''}`} />
                  <span>{currentLikes.toLocaleString()}</span>
                </Button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{Math.floor(currentLikes * 0.1).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handlePreview}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCopyJSON}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      {previewData && (
        <FramePreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          frameData={previewData}
          frameJson={previewJson}
        />
      )}
    </>
  );
}