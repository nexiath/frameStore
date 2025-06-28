'use client';

import { motion } from 'framer-motion';
import { FrameEditor } from '@/components/frame-editor';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
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
        <div>
          <h1 className="text-3xl font-bold">Frame Editor</h1>
          <p className="text-muted-foreground">Create your custom Farcaster Frame</p>
        </div>
      </motion.div>

      {/* Editor Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <FrameEditor />
      </motion.div>
    </div>
  );
}