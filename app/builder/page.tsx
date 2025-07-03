'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FramePreview } from '@/components/FramePreview';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import FrameBuilder to avoid SSR issues
const FrameBuilder = dynamic(
  () => import('@/components/FrameBuilder').then((mod) => ({ default: mod.FrameBuilder })),
  { ssr: false }
);

interface FrameData {
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
}

export default function BuilderPage() {
  const [frameData, setFrameData] = useState<FrameData>({
    title: 'My Awesome Frame',
    description: 'An interactive Farcaster Frame that does amazing things',
    image_url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    button1_label: 'Click Me!',
    button1_target: 'https://example.com'
  });
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFrameChange = (newFrameData: FrameData, json: string) => {
    setFrameData(newFrameData);
  };

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
            Back to Home
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Frame Builder</h1>
          <p className="text-muted-foreground">Create your custom Farcaster Frame with live preview</p>
        </div>
      </motion.div>

      {/* Builder Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isClient && (
            <FrameBuilder onFrameChange={handleFrameChange} />
          )}
        </motion.div>

        {/* Right: Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:sticky lg:top-8"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Live Preview</h2>
            <FramePreview frameData={frameData} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}