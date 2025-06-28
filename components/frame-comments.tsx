'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Heart, Reply } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isVerified?: boolean;
}

interface FrameCommentsProps {
  frameId: string;
}

// Mock comments data
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'vitalik.eth',
    content: 'This Frame is amazing! Love the clean design and smooth UX.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    isVerified: true
  },
  {
    id: '2',
    author: 'cryptodev.eth',
    content: 'Great work on the implementation. The JSON structure is perfect.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8
  },
  {
    id: '3',
    author: 'framebuilder',
    content: 'Can you share the code for this? Would love to learn from it.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 5
  }
];

export function FrameComments({ frameId }: FrameCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'you.eth',
      content: newComment,
      timestamp: new Date(),
      likes: 0
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
    
    toast.success('Comment posted!', {
      description: 'Your comment has been added to the discussion',
      duration: 2000,
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
    
    toast.success('Liked!', {
      duration: 1000,
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this Frame..."
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Post Comment
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm">
                          {comment.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          {comment.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(comment.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLikeComment(comment.id)}
                      className="gap-1 h-8 px-2"
                    >
                      <Heart className="h-3 w-3" />
                      {comment.likes}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 h-8 px-2"
                    >
                      <Reply className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}