'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface FrameEmbedProps {
  frameId: string;
  frameTitle: string;
}

export function FrameEmbed({ frameId, frameTitle }: FrameEmbedProps) {
  const [embedConfig, setEmbedConfig] = useState({
    width: '400',
    height: '300',
    theme: 'light' as 'light' | 'dark',
    showTitle: true,
    showStats: true
  });

  const generateEmbedCode = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://framestore.vercel.app';
    const embedUrl = `${baseUrl}/embed/${frameId}?theme=${embedConfig.theme}&title=${embedConfig.showTitle}&stats=${embedConfig.showStats}`;
    
    return `<iframe
  src="${embedUrl}"
  width="${embedConfig.width}"
  height="${embedConfig.height}"
  frameborder="0"
  allowtransparency="true"
  sandbox="allow-scripts allow-same-origin"
  title="${frameTitle} - FrameStore Embed">
</iframe>`;
  };

  const generateScriptCode = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://framestore.vercel.app';
    
    return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/embed.js';
    script.setAttribute('data-frame-id', '${frameId}');
    script.setAttribute('data-width', '${embedConfig.width}');
    script.setAttribute('data-height', '${embedConfig.height}');
    script.setAttribute('data-theme', '${embedConfig.theme}');
    document.head.appendChild(script);
  })();
</script>`;
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied!', {
      description: `${type} code copied to clipboard`,
      duration: 2000,
    });
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Downloaded!', {
      description: `${filename} has been downloaded`,
      duration: 2000,
    });
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
            <Code className="h-5 w-5" />
            Embed Frame
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  value={embedConfig.width}
                  onChange={(e) => setEmbedConfig(prev => ({ ...prev, width: e.target.value }))}
                  placeholder="400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  value={embedConfig.height}
                  onChange={(e) => setEmbedConfig(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="300"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={embedConfig.theme === 'light' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setEmbedConfig(prev => ({ ...prev, theme: 'light' }))}
              >
                Light Theme
              </Badge>
              <Badge
                variant={embedConfig.theme === 'dark' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setEmbedConfig(prev => ({ ...prev, theme: 'dark' }))}
              >
                Dark Theme
              </Badge>
              <Badge
                variant={embedConfig.showTitle ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setEmbedConfig(prev => ({ ...prev, showTitle: !prev.showTitle }))}
              >
                Show Title
              </Badge>
              <Badge
                variant={embedConfig.showStats ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setEmbedConfig(prev => ({ ...prev, showStats: !prev.showStats }))}
              >
                Show Stats
              </Badge>
            </div>
          </div>

          {/* Code Tabs */}
          <Tabs defaultValue="iframe" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="iframe">IFrame Embed</TabsTrigger>
              <TabsTrigger value="script">Script Embed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="iframe" className="space-y-4">
              <div className="space-y-2">
                <Label>IFrame Code</Label>
                <Textarea
                  value={generateEmbedCode()}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(generateEmbedCode(), 'IFrame')}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCode(generateEmbedCode(), 'frame-embed.html')}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="script" className="space-y-4">
              <div className="space-y-2">
                <Label>Script Code</Label>
                <Textarea
                  value={generateScriptCode()}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(generateScriptCode(), 'Script')}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCode(generateScriptCode(), 'frame-script.html')}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-muted/50">
              <div 
                className="border rounded bg-background mx-auto"
                style={{ 
                  width: `${Math.min(parseInt(embedConfig.width) || 400, 400)}px`,
                  height: `${Math.min(parseInt(embedConfig.height) || 300, 200)}px`
                }}
              >
                <div className="p-4 h-full flex items-center justify-center text-sm text-muted-foreground">
                  Frame Embed Preview
                  <br />
                  {embedConfig.width} × {embedConfig.height}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}