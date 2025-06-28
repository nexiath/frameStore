'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

interface FrameData {
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
}

interface FramePreviewProps {
  frameData: FrameData;
}

export function FramePreview({ frameData }: FramePreviewProps) {
  const isButtonDisabled = !frameData.button1_target || frameData.button1_target.trim() === '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* iPhone Mockup */}
          <div className="relative mx-auto max-w-sm">
            {/* Phone Frame */}
            <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-black rounded-[2rem] overflow-hidden">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-6 py-2 bg-black text-white text-sm">
                  <div className="flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                  </div>
                  <div className="text-center font-medium">9:41</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">100%</span>
                    <Battery className="h-3 w-3" />
                  </div>
                </div>

                {/* App Content */}
                <div className="bg-white min-h-[600px]">
                  {/* Header */}
                  <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-600 to-cyan-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">Warpcast</div>
                        <div className="text-white/80 text-xs">@framestore</div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4 space-y-3">
                    <div className="text-sm text-gray-700">
                      Check out this awesome Frame! 🚀
                    </div>

                    {/* Frame Card */}
                    <motion.div 
                      className="border rounded-lg overflow-hidden shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Frame Image */}
                      <div className="relative aspect-[3/2] bg-gray-100">
                        {frameData.image_url ? (
                          <Image
                            src={frameData.image_url}
                            alt={frameData.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Smartphone className="h-12 w-12" />
                          </div>
                        )}
                        
                        {/* Frame Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <div className="text-white font-medium text-sm">
                            {frameData.title || 'Untitled Frame'}
                          </div>
                        </div>
                      </div>

                      {/* Frame Button */}
                      <div className="p-3 bg-gray-50 border-t">
                        <motion.div
                          whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
                          whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
                        >
                          <Button
                            size="sm"
                            className="w-full text-xs h-8"
                            disabled={isButtonDisabled}
                            variant={isButtonDisabled ? "secondary" : "default"}
                          >
                            {frameData.button1_label || 'Button'}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Interaction Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                      <span>❤️ 42</span>
                      <span>🔄 12</span>
                      <span>💬 8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}