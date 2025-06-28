'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TemplatesMarketplace } from '@/components/templates-marketplace';
import { FramePreview } from '@/components/FramePreview';
import { ArrowLeft, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleTemplateSelect = (templateData: any) => {
    setSelectedTemplate(templateData);
    
    // Store template data in localStorage for the builder
    localStorage.setItem('framestore_template_data', JSON.stringify(templateData));
    
    toast.success('Template selected!', {
      description: 'Redirecting to builder...',
      action: {
        label: 'Go to Builder',
        onClick: () => router.push('/builder'),
      },
    });

    // Redirect to builder after a short delay
    setTimeout(() => {
      router.push('/builder');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Templates Marketplace
          </h1>
          <p className="text-muted-foreground">
            Discover and use professionally designed Frame templates
          </p>
        </div>
        <Link href="/builder">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create from Scratch
          </Button>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
          Professional Frame Templates
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Skip the design work and start with battle-tested templates. 
          Each template is optimized for engagement and ready to customize.
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
            <span>50+ Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            <span>Production Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full" />
            <span>One-Click Use</span>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Templates Marketplace */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <TemplatesMarketplace onTemplateSelect={handleTemplateSelect} />
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:sticky lg:top-8"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Template Preview</h2>
            {selectedTemplate ? (
              <div className="space-y-4">
                <FramePreview frameData={selectedTemplate} />
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">{selectedTemplate.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.description}
                  </p>
                  <Button 
                    className="w-full gap-2"
                    onClick={() => handleTemplateSelect(selectedTemplate)}
                  >
                    <Plus className="h-4 w-4" />
                    Use This Template
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Select a template to see preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.section 
        className="space-y-8 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Why Use Templates?</h2>
          <p className="text-muted-foreground">Save time and get better results with proven designs</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Proven Performance',
              description: 'All templates are tested for optimal engagement rates',
              icon: '📊'
            },
            {
              title: 'Easy Customization',
              description: 'Modify colors, text, and images to match your brand',
              icon: '🎨'
            },
            {
              title: 'Best Practices',
              description: 'Built following Farcaster Frame specifications',
              icon: '✅'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-lg border bg-card"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}