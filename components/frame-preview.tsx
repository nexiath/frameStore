'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

interface FrameButton {
  id: string;
  label: string;
  action: 'post' | 'post_redirect' | 'link';
  target?: string;
}

interface FrameData {
  title: string;
  description: string;
  image: string;
  buttons: FrameButton[];
  postUrl: string;
}

interface FramePreviewProps {
  frameData: FrameData;
}

export function FramePreview({ frameData }: FramePreviewProps) {
  return (
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Frame Image */}
                    <div className="relative aspect-[1.91/1] bg-gray-100">
                      {frameData.image ? (
                        <Image
                          src={frameData.image}
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
                          {frameData.title}
                        </div>
                      </div>
                    </div>

                    {/* Frame Buttons */}
                    <div className="p-3 bg-gray-50 border-t">
                      <div className={`grid gap-2 ${
                        frameData.buttons.length === 1 ? 'grid-cols-1' :
                        frameData.buttons.length === 2 ? 'grid-cols-2' :
                        frameData.buttons.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
                      }`}>
                        {frameData.buttons.map((button, index) => (
                          <motion.div
                            key={button.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <Button
                              size="sm"
                              variant={button.action === 'link' ? 'outline' : 'default'}
                              className="w-full text-xs h-8 relative"
                              onClick={() => {}}
                            >
                              {button.label}
                              {button.action !== 'post' && (
                                <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                                  {button.action === 'link' ? 'Link' : 'Redirect'}
                                </Badge>
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
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
  );
}