'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Wand2, 
  Download, 
  RefreshCw, 
  Palette, 
  Camera, 
  Zap, 
  Upload, 
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  FileImage,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface AIImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
}

const STYLE_PRESETS = [
  { name: 'Cyberpunk', prompt: 'cyberpunk neon futuristic digital art style', color: 'from-purple-500 to-pink-500' },
  { name: 'Minimalist', prompt: 'clean minimalist modern design', color: 'from-gray-400 to-gray-600' },
  { name: 'Abstract', prompt: 'abstract geometric colorful art', color: 'from-blue-500 to-green-500' },
  { name: 'Retro', prompt: 'retro vintage 80s synthwave style', color: 'from-orange-500 to-red-500' },
  { name: 'Professional', prompt: 'professional corporate clean design', color: 'from-blue-600 to-indigo-600' },
  { name: 'Artistic', prompt: 'artistic creative expressive style', color: 'from-purple-600 to-pink-600' }
];

const QUICK_PROMPTS = [
  'Futuristic NFT marketplace with holographic displays',
  'Minimalist DeFi dashboard with clean typography',
  'Cyberpunk crypto trading interface with neon charts',
  'Abstract blockchain network visualization',
  'Professional Web3 company logo design',
  'Retro gaming NFT collection artwork'
];

// API endpoints pour la génération d'images
const AI_PROVIDERS = {
  pollinations: 'https://image.pollinations.ai/prompt/',
  picsum: 'https://picsum.photos/600/400?random=',
  placeholder: 'https://via.placeholder.com/600x400/'
};

export function AIImageGenerator({ onImageGenerated }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Génération d'images AI réelle
  const generateImages = async () => {
    if (!prompt.trim() && !selectedStyle) {
      toast.error('Please enter a prompt or select a style');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const fullPrompt = prompt + (selectedStyle ? `, ${selectedStyle}` : '');
      const encodedPrompt = encodeURIComponent(fullPrompt);
      
      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Génération de plusieurs variations
      const imagePromises = Array.from({ length: 4 }, (_, index) => {
        const seed = Math.floor(Math.random() * 1000000);
        return `${AI_PROVIDERS.pollinations}${encodedPrompt}&seed=${seed}&width=600&height=400&model=flux&enhance=true`;
      });

      // Attendre que les images soient "générées"
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGenerationProgress(100);
      clearInterval(progressInterval);
      
      setGeneratedImages(imagePromises);
      setSelectedImage(imagePromises[0]);
      
      toast.success('Images Generated!', {
        description: `Generated ${imagePromises.length} variations using AI`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Generation failed', {
        description: 'Please try again with a different prompt',
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // Upload de fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImages(prev => [...prev, result]);
          toast.success('Image uploaded!', {
            description: `${file.name} has been added to your collection`,
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Invalid file type', {
          description: 'Please upload only image files (JPG, PNG, GIF, WebP)',
        });
      }
    });
  };

  // Ajout d'image par URL
  const addImageFromUrl = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    try {
      new URL(imageUrl); // Validation de l'URL
      setUploadedImages(prev => [...prev, imageUrl]);
      setImageUrl('');
      toast.success('Image added!', {
        description: 'Image from URL has been added to your collection',
      });
    } catch {
      toast.error('Invalid URL', {
        description: 'Please enter a valid image URL',
      });
    }
  };

  // Utiliser une image
  const useImage = (imageUrl: string) => {
    if (onImageGenerated) {
      onImageGenerated(imageUrl);
      toast.success('Image Applied!', {
        description: 'The image has been applied to your frame',
        duration: 2000,
      });
    }
  };

  // Télécharger une image
  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `framestore-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download Started!', {
        description: 'Your image is being downloaded',
        duration: 2000,
      });
    } catch (error) {
      toast.error('Download failed', {
        description: 'Please try right-clicking and saving the image',
      });
    }
  };

  // Supprimer une image uploadée
  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    toast.info('Image removed');
  };

  // Appliquer un preset de style
  const applyStylePreset = (style: string) => {
    setSelectedStyle(style);
    setPrompt(prev => {
      const basePrompt = prev.replace(/,?\s*(cyberpunk|minimalist|abstract|retro|professional|artistic)[^,]*,?/gi, '').trim();
      return basePrompt ? `${basePrompt}, ${style}` : style;
    });
  };

  // Utiliser un prompt rapide
  const useQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Image Generator & Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai-generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai-generate" className="gap-2">
                <Wand2 className="h-4 w-4" />
                AI Generate
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <LinkIcon className="h-4 w-4" />
                From URL
              </TabsTrigger>
            </TabsList>
            
            {/* AI Generation Tab */}
            <TabsContent value="ai-generate" className="space-y-6 mt-6">
              {/* Quick Prompts */}
              <div className="space-y-2">
                <Label>Quick Prompts</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map((quickPrompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => useQuickPrompt(quickPrompt)}
                      className="justify-start text-left h-auto py-2 px-3"
                    >
                      <span className="text-xs">{quickPrompt}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Style Presets */}
              <div className="space-y-2">
                <Label>Style Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {STYLE_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant={selectedStyle === preset.prompt ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyStylePreset(preset.prompt)}
                      className="justify-start gap-2 relative overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${preset.color} opacity-10`} />
                      <Palette className="h-3 w-3" />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Custom Description</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A futuristic NFT marketplace with neon colors and digital art, cyberpunk style..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              {/* Generate Button */}
              <Button
                onClick={generateImages}
                disabled={isGenerating}
                className="w-full gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating AI Images...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating images...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}
              
              {/* Generated Images Grid */}
              {generatedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">AI Generated Images</Label>
                    <Badge variant="secondary" className="gap-1">
                      <Camera className="h-3 w-3" />
                      {generatedImages.length} variations
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {generatedImages.map((imageUrl, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative aspect-[3/2] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedImage === imageUrl 
                            ? 'border-purple-500 ring-2 ring-purple-200' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => setSelectedImage(imageUrl)}
                      >
                        <Image
                          src={imageUrl}
                          alt={`Generated variation ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=AI+Generated+${index + 1}`;
                          }}
                        />
                        {selectedImage === imageUrl && (
                          <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                            <Badge className="bg-purple-600">Selected</Badge>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {selectedImage && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => useImage(selectedImage)} 
                        className="flex-1 gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        Use This Image
                      </Button>
                      <Button 
                        onClick={() => downloadImage(selectedImage)} 
                        variant="outline" 
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </TabsContent>

            {/* Upload Files Tab */}
            <TabsContent value="upload" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                    size="lg"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Images from Computer
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supports JPG, PNG, GIF, WebP • Multiple files allowed
                  </p>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    files.forEach(file => {
                      if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = e.target?.result as string;
                          setUploadedImages(prev => [...prev, result]);
                        };
                        reader.readAsDataURL(file);
                      }
                    });
                    toast.success(`${files.length} images uploaded!`);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Drag and drop images here, or click the button above
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* URL Tab */}
            <TabsContent value="url" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button onClick={addImageFromUrl} className="gap-2">
                      <Globe className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                  <strong>💡 Tip:</strong> You can use images from Unsplash, Pexels, or any public image URL. 
                  Make sure the URL ends with an image extension (.jpg, .png, .gif, .webp).
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Uploaded Images Gallery */}
          {uploadedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mt-6 pt-6 border-t"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Your Images</Label>
                <Badge variant="secondary" className="gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {uploadedImages.length} images
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedImages.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[3/2] rounded-lg overflow-hidden border group"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => useImage(imageUrl)}
                        className="gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Use
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(imageUrl)}
                        className="gap-1"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeUploadedImage(index)}
                        className="gap-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tips */}
          <div className="text-xs text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg mt-6">
            <strong>🎨 AI Generation Tips:</strong> Be specific with your prompts. Include style, colors, mood, and subject matter. 
            Try combinations like "minimalist NFT art with purple gradients\" or "cyberpunk DeFi interface with neon blue".
            <br /><br />
            <strong>📁 Upload Tips:</strong> Use high-quality images (600×400 recommended). Supported formats: JPG, PNG, GIF, WebP.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}