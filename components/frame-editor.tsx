'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FramePreview } from '@/components/frame-preview';
import { JsonPreview } from '@/components/json-preview';
import { Copy, Download, Plus, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

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

export function FrameEditor() {
  const [frameData, setFrameData] = useState<FrameData>({
    title: 'My Awesome Frame',
    description: 'An interactive Farcaster Frame',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    buttons: [
      { id: '1', label: 'Click Me!', action: 'post' }
    ],
    postUrl: 'https://api.example.com/frame'
  });

  const [generatedJSON, setGeneratedJSON] = useState('');

  // Generate Frame JSON
  useEffect(() => {
    const frameJSON = {
      "fc:frame": "vNext",
      "fc:frame:image": frameData.image,
      "fc:frame:post_url": frameData.postUrl,
      "og:title": frameData.title,
      "og:description": frameData.description,
      "og:image": frameData.image,
      ...frameData.buttons.reduce((acc, button, index) => {
        const buttonNum = index + 1;
        acc[`fc:frame:button:${buttonNum}`] = button.label;
        if (button.action !== 'post') {
          acc[`fc:frame:button:${buttonNum}:action`] = button.action;
        }
        if (button.target) {
          acc[`fc:frame:button:${buttonNum}:target`] = button.target;
        }
        return acc;
      }, {} as Record<string, string>)
    };

    setGeneratedJSON(JSON.stringify(frameJSON, null, 2));
  }, [frameData]);

  const addButton = () => {
    if (frameData.buttons.length >= 4) return;
    
    const newButton: FrameButton = {
      id: Date.now().toString(),
      label: `Button ${frameData.buttons.length + 1}`,
      action: 'post'
    };
    
    setFrameData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton]
    }));
  };

  const removeButton = (id: string) => {
    setFrameData(prev => ({
      ...prev,
      buttons: prev.buttons.filter(button => button.id !== id)
    }));
  };

  const updateButton = (id: string, updates: Partial<FrameButton>) => {
    setFrameData(prev => ({
      ...prev,
      buttons: prev.buttons.map(button =>
        button.id === id ? { ...button, ...updates } : button
      )
    }));
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(generatedJSON);
    toast.success('Frame JSON copied to clipboard!');
  };

  const downloadJSON = () => {
    const blob = new Blob([generatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'frame.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Frame JSON downloaded!');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Editor Form */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Frame Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={frameData.title}
                  onChange={(e) => setFrameData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter frame title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={frameData.description}
                  onChange={(e) => setFrameData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your frame..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={frameData.image}
                  onChange={(e) => setFrameData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.png"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postUrl">Post URL</Label>
                <Input
                  id="postUrl"
                  value={frameData.postUrl}
                  onChange={(e) => setFrameData(prev => ({ ...prev, postUrl: e.target.value }))}
                  placeholder="https://api.example.com/frame"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Buttons</Label>
                <Button
                  size="sm"
                  onClick={addButton}
                  disabled={frameData.buttons.length >= 4}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Button
                </Button>
              </div>
              
              <div className="space-y-3">
                {frameData.buttons.map((button, index) => (
                  <motion.div
                    key={button.id}
                    className="p-4 border rounded-lg space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Button {index + 1}</Badge>
                      {frameData.buttons.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeButton(button.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Input
                      value={button.label}
                      onChange={(e) => updateButton(button.id, { label: e.target.value })}
                      placeholder="Button label..."
                    />
                    
                    <select
                      className="w-full p-2 border rounded-md"
                      value={button.action}
                      onChange={(e) => updateButton(button.id, { 
                        action: e.target.value as FrameButton['action'],
                        target: e.target.value === 'link' ? button.target || '' : undefined
                      })}
                    >
                      <option value="post">Post Action</option>
                      <option value="post_redirect">Post & Redirect</option>
                      <option value="link">External Link</option>
                    </select>
                    
                    {button.action === 'link' && (
                      <Input
                        value={button.target || ''}
                        onChange={(e) => updateButton(button.id, { target: e.target.value })}
                        placeholder="https://example.com"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview & JSON */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="json">JSON Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-6">
            <FramePreview frameData={frameData} />
          </TabsContent>
          
          <TabsContent value="json" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated JSON</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={copyJSON} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadJSON} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <JsonPreview json={generatedJSON} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}