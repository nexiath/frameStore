'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FramePreview } from '@/components/FramePreview';
import { useAnalyticsTracking } from '@/hooks/use-analytics';
import { 
  ExternalLink, 
  Copy, 
  Share, 
  Download,
  Smartphone,
  Monitor,
  Tablet,
  QrCode
} from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface FramePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  frameData: {
    id?: string;
    title: string;
    description: string;
    image_url: string;
    button1_label: string;
    button1_target: string;
    json_full?: any;
  };
  frameJson?: string;
}

export function FramePreviewModal({ 
  isOpen, 
  onClose, 
  frameData, 
  frameJson 
}: FramePreviewModalProps) {
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { trackFrameView } = useAnalyticsTracking();

  // Track preview view
  const handlePreviewView = () => {
    if (frameData.id) {
      trackFrameView(frameData.id);
    }
  };

  // Generate QR code for sharing
  const generateQRCode = async () => {
    try {
      const frameUrl = `${window.location.origin}/frame/${frameData.id || 'preview'}`;
      const qrDataUrl = await QRCode.toDataURL(frameUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
      setShowQR(true);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const copyFrameJSON = () => {
    if (frameJson) {
      navigator.clipboard.writeText(frameJson);
      toast.success('Frame JSON copied to clipboard!');
    }
  };

  const copyFrameURL = () => {
    const frameUrl = `${window.location.origin}/frame/${frameData.id || 'preview'}`;
    navigator.clipboard.writeText(frameUrl);
    toast.success('Frame URL copied to clipboard!');
  };

  const shareFrame = async () => {
    const frameUrl = `${window.location.origin}/frame/${frameData.id || 'preview'}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: frameData.title,
          text: frameData.description,
          url: frameUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyFrameURL();
    }
  };

  const openInWarpcast = () => {
    const frameUrl = `${window.location.origin}/frame/${frameData.id || 'preview'}`;
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      `Check out this Frame: ${frameData.title}\n\n${frameUrl}`
    )}`;
    window.open(warpcastUrl, '_blank');
  };

  const downloadJSON = () => {
    if (frameJson) {
      const blob = new Blob([frameJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${frameData.title.toLowerCase().replace(/\s+/g, '-')}-frame.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Frame JSON downloaded!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
        {/* Header - Only one close button here */}
        <DialogHeader className="p-6 pb-0 border-b">
          <DialogTitle className="text-xl font-bold">
            Frame Preview: {frameData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(95vh-80px)]">
          {/* Preview Area - Scrollable */}
          <ScrollArea className="flex-1 h-full">
            <div className="p-6">
              {/* Device Toggle */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Button
                  size="sm"
                  variant={deviceView === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setDeviceView('mobile')}
                  className="gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'tablet' ? 'default' : 'outline'}
                  onClick={() => setDeviceView('tablet')}
                  className="gap-2"
                >
                  <Tablet className="h-4 w-4" />
                  Tablet
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setDeviceView('desktop')}
                  className="gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Button>
              </div>

              {/* Frame Preview */}
              <div className="flex justify-center">
                <motion.div
                  key={deviceView}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    ${deviceView === 'mobile' ? 'max-w-sm' : ''}
                    ${deviceView === 'tablet' ? 'max-w-md' : ''}
                    ${deviceView === 'desktop' ? 'max-w-2xl' : ''}
                  `}
                  onAnimationComplete={handlePreviewView}
                >
                  <FramePreview frameData={frameData} />
                </motion.div>
              </div>

              {/* Frame Info */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">{frameData.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {frameData.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    Button: {frameData.button1_label}
                  </Badge>
                  <Badge variant="outline">
                    Target: {frameData.button1_target}
                  </Badge>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Actions Panel - Fixed width, scrollable content */}
          <div className="lg:w-80 border-l bg-muted/20">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Frame Actions</h3>

                {/* Primary Actions */}
                <div className="space-y-2">
                  <Button 
                    className="w-full gap-2" 
                    onClick={openInWarpcast}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Test in Warpcast
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={shareFrame}
                  >
                    <Share className="h-4 w-4" />
                    Share Frame
                  </Button>
                </div>

                {/* Copy Actions */}
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                    onClick={copyFrameURL}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Frame URL
                  </Button>
                  
                  {frameJson && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={copyFrameJSON}
                    >
                      <Copy className="h-4 w-4" />
                      Copy JSON
                    </Button>
                  )}
                </div>

                {/* QR Code */}
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                    onClick={generateQRCode}
                  >
                    <QrCode className="h-4 w-4" />
                    Generate QR Code
                  </Button>
                  
                  <AnimatePresence>
                    {showQR && qrCodeUrl && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center p-4 bg-white rounded-lg border"
                      >
                        <img src={qrCodeUrl} alt="Frame QR Code" className="w-32 h-32" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Download */}
                {frameJson && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                    onClick={downloadJSON}
                  >
                    <Download className="h-4 w-4" />
                    Download JSON
                  </Button>
                )}

                {/* Frame Stats (if available) */}
                {frameData.id && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Quick Stats</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Frame ID:</span>
                        <span className="font-mono text-xs">
                          {frameData.id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>Just now</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">💡 Preview Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Test on different device sizes</li>
                    <li>• Check button interactions</li>
                    <li>• Verify image loading</li>
                    <li>• Share QR code for mobile testing</li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}