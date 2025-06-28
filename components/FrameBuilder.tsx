'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIImageGenerator } from '@/components/ai-image-generator';
import { NFTMintFrame } from '@/components/nft-mint-frame';
import { SignatureFrame } from '@/components/signature-frame';
import { TemplatesMarketplace } from '@/components/templates-marketplace';
import { FrameVersions } from '@/components/frame-versions';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { FramePreviewModal } from '@/components/frame-preview-modal';
import { useAuth } from '@/hooks/use-auth';
import { useFrameActions } from '@/hooks/use-frames';
import { useAnalyticsTracking } from '@/hooks/use-analytics';
import { useFramePreview } from '@/hooks/use-frame-preview';
import { Copy, Download, Plus, X, Image as ImageIcon, Sparkles, Save, Coins, PenTool, GitBranch, BarChart3, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const frameSchema = {
  type: "object",
  properties: {
    "fc:frame": { type: "string", const: "vNext" },
    "fc:frame:image": { type: "string", format: "uri" },
    "fc:frame:button:1": { type: "string", minLength: 1 },
    "fc:frame:button:1:action": { type: "string", enum: ["post", "post_redirect", "link"] },
    "fc:frame:button:1:target": { type: "string", format: "uri" },
    "fc:frame:post_url": { type: "string", format: "uri" },
    "og:title": { type: "string", minLength: 1 },
    "og:description": { type: "string", minLength: 1 },
    "og:image": { type: "string", format: "uri" }
  },
  required: ["fc:frame", "fc:frame:image", "fc:frame:button:1", "og:title", "og:description", "og:image"]
};

interface FrameData {
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
}

interface FrameBuilderProps {
  onFrameChange?: (frameData: FrameData, json: string) => void;
}

export function FrameBuilder({ onFrameChange }: FrameBuilderProps) {
  const router = useRouter();
  const { authState } = useAuth();
  const { createFrame, isLoading: isSaving } = useFrameActions();
  const { trackFrameView } = useAnalyticsTracking();
  const { isPreviewOpen, previewData, previewJson, openPreview, closePreview } = useFramePreview();
  
  const [frameData, setFrameData] = useState<FrameData>({
    title: 'My Awesome Frame',
    description: 'An interactive Farcaster Frame that does amazing things',
    image_url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    button1_label: 'Click Me!',
    button1_target: 'https://example.com'
  });

  const [generatedJSON, setGeneratedJSON] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentFrameId, setCurrentFrameId] = useState<string | null>(null);

  // Load template data from localStorage if available
  useEffect(() => {
    const templateData = localStorage.getItem('framestore_template_data');
    if (templateData) {
      try {
        const parsed = JSON.parse(templateData);
        setFrameData(parsed);
        localStorage.removeItem('framestore_template_data'); // Clean up
        toast.success('Template loaded!', {
          description: 'Template data has been applied to the builder',
        });
      } catch (error) {
        console.error('Error loading template data:', error);
      }
    }
  }, []);

  // Generate Frame JSON in real-time
  useEffect(() => {
    const frameJSON = {
      "fc:frame": "vNext",
      "fc:frame:image": frameData.image_url,
      "fc:frame:button:1": frameData.button1_label,
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": frameData.button1_target,
      "fc:frame:post_url": "https://api.example.com/frame",
      "og:title": frameData.title,
      "og:description": frameData.description,
      "og:image": frameData.image_url
    };

    const jsonString = JSON.stringify(frameJSON, null, 2);
    setGeneratedJSON(jsonString);
    
    // Notify parent component of changes
    if (onFrameChange) {
      onFrameChange(frameData, jsonString);
    }
  }, [frameData, onFrameChange]);

  const handleInputChange = (field: keyof FrameData, value: string) => {
    setFrameData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageGenerated = (imageUrl: string) => {
    handleInputChange('image_url', imageUrl);
    toast.success('Image applied to frame!');
  };

  const handleAdvancedFrameGenerated = (advancedFrameData: any) => {
    setFrameData({
      title: advancedFrameData.title,
      description: advancedFrameData.description,
      image_url: advancedFrameData.image_url,
      button1_label: advancedFrameData.button1_label,
      button1_target: advancedFrameData.button1_target
    });
    
    toast.success('Advanced Frame configured!', {
      description: 'Your Web3 Frame is ready to deploy',
    });
  };

  const handleTemplateSelect = (templateData: any) => {
    setFrameData(templateData);
    toast.success('Template applied!', {
      description: 'Template has been loaded into the builder',
    });
  };

  const handlePreview = () => {
    const previewFrameData = {
      id: currentFrameId || undefined,
      ...frameData,
    };

    openPreview(previewFrameData, generatedJSON);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedJSON);
      setCopied(true);
      toast.success('Copied!', {
        description: 'Frame JSON copied to clipboard',
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([generatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-frame.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!', {
      description: 'Frame JSON file downloaded successfully',
      duration: 2000,
    });
  };

  const handleSaveFrame = async () => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to save frames', {
        description: 'Connect your wallet and sign in to continue',
      });
      return;
    }

    const frame = await createFrame({
      title: frameData.title,
      description: frameData.description,
      image_url: frameData.image_url,
      button1_label: frameData.button1_label,
      button1_target: frameData.button1_target,
      json_full: JSON.parse(generatedJSON),
    });

    if (frame) {
      setCurrentFrameId(frame.id);
      
      // Track frame creation
      trackFrameView(frame.id);
      
      toast.success('Frame saved!', {
        description: 'Your frame has been saved to your dashboard',
        action: {
          label: 'View Dashboard',
          onClick: () => router.push('/dashboard'),
        },
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="ai-image">AI Images</TabsTrigger>
              <TabsTrigger value="nft-mint">NFT Mint</TabsTrigger>
              <TabsTrigger value="signature">Signatures</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Frame Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={frameData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter frame title..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="button1_label">Button Label</Label>
                      <Input
                        id="button1_label"
                        value={frameData.button1_label}
                        onChange={(e) => handleInputChange('button1_label', e.target.value)}
                        placeholder="Button text..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={frameData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your frame..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={frameData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="button1_target">Button Target URL</Label>
                    <Input
                      id="button1_target"
                      value={frameData.button1_target}
                      onChange={(e) => handleInputChange('button1_target', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates" className="mt-6">
              <TemplatesMarketplace onTemplateSelect={handleTemplateSelect} />
            </TabsContent>
            
            <TabsContent value="ai-image" className="mt-6">
              <AIImageGenerator onImageGenerated={handleImageGenerated} />
            </TabsContent>

            <TabsContent value="nft-mint" className="mt-6">
              <NFTMintFrame onFrameGenerated={handleAdvancedFrameGenerated} />
            </TabsContent>

            <TabsContent value="signature" className="mt-6">
              <SignatureFrame onFrameGenerated={handleAdvancedFrameGenerated} />
            </TabsContent>

            <TabsContent value="versions" className="mt-6">
              {currentFrameId ? (
                <FrameVersions frameId={currentFrameId} />
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Save Frame First</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Save your frame to start tracking versions and changes
                    </p>
                    <Button onClick={handleSaveFrame} disabled={!authState.isAuthenticated}>
                      Save Frame to Enable Versioning
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {currentFrameId ? (
                <AnalyticsDashboard frameId={currentFrameId} />
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Save Frame First</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Save your frame to start tracking analytics and performance
                    </p>
                    <Button onClick={handleSaveFrame} disabled={!authState.isAuthenticated}>
                      Save Frame to Enable Analytics
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Enhanced JSON Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated JSON</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handlePreview}
                    className="gap-2"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  
                  {authState.isAuthenticated && (
                    <Button
                      size="sm"
                      onClick={handleSaveFrame}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Frame
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                    variant={copied ? "default" : "outline"}
                  >
                    {copied ? (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={downloadJSON}
                    className="gap-2"
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm border">
                <code className="language-json">{generatedJSON}</code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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