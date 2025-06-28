'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Code, CheckCircle, ExternalLink, Lightbulb, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const CHECKLIST_ITEMS = [
  { id: 1, text: 'Use high-quality images (600×400 recommended)', completed: true },
  { id: 2, text: 'Keep button labels short and actionable', completed: true },
  { id: 3, text: 'Test your Frame on multiple devices', completed: false },
  { id: 4, text: 'Ensure fast loading times', completed: true },
  { id: 5, text: 'Add proper error handling', completed: false },
  { id: 6, text: 'Include analytics tracking', completed: false }
];

const CODE_EXAMPLES = {
  basic: `{
  "fc:frame": "vNext",
  "fc:frame:image": "https://example.com/image.png",
  "fc:frame:button:1": "Click Me!",
  "fc:frame:button:1:action": "post",
  "fc:frame:post_url": "https://api.example.com/frame",
  "og:title": "My Awesome Frame",
  "og:description": "An interactive Farcaster Frame",
  "og:image": "https://example.com/image.png"
}`,
  advanced: `{
  "fc:frame": "vNext",
  "fc:frame:image": "https://example.com/nft-mint.png",
  "fc:frame:button:1": "Mint NFT",
  "fc:frame:button:1:action": "post",
  "fc:frame:button:2": "View Collection",
  "fc:frame:button:2:action": "link",
  "fc:frame:button:2:target": "https://opensea.io/collection/my-nft",
  "fc:frame:post_url": "https://api.example.com/mint",
  "fc:frame:input:text": "Enter quantity",
  "og:title": "Exclusive NFT Mint",
  "og:description": "Mint limited edition NFTs directly from Farcaster",
  "og:image": "https://example.com/nft-mint.png"
}`,
  poll: `{
  "fc:frame": "vNext",
  "fc:frame:image": "https://example.com/poll-question.png",
  "fc:frame:button:1": "Option A",
  "fc:frame:button:1:action": "post",
  "fc:frame:button:2": "Option B", 
  "fc:frame:button:2:action": "post",
  "fc:frame:button:3": "View Results",
  "fc:frame:button:3:action": "post_redirect",
  "fc:frame:button:3:target": "https://example.com/poll-results",
  "fc:frame:post_url": "https://api.example.com/poll-vote",
  "og:title": "Community Poll",
  "og:description": "Vote on important community decisions",
  "og:image": "https://example.com/poll-question.png"
}`
};

export default function DocsPage() {
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
        <div>
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="text-muted-foreground">Learn how to create effective Farcaster Frames</p>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Frame Development Guide
          </h2>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Master the art of creating engaging, interactive Frames that captivate your audience 
          and drive meaningful interactions on Farcaster.
        </p>
      </motion.section>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>What are Farcaster Frames?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Farcaster Frames are interactive applications that run directly within social media posts. 
                  They allow users to perform actions like minting NFTs, voting in polls, or making purchases 
                  without leaving their social feed.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Key Benefits
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• Seamless user experience</li>
                      <li>• Higher engagement rates</li>
                      <li>• Reduced friction for actions</li>
                      <li>• Native social integration</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      Use Cases
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• NFT minting and trading</li>
                      <li>• DAO governance voting</li>
                      <li>• Event RSVPs</li>
                      <li>• Community polls</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frame Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Every Frame consists of meta tags that define its behavior and appearance:
                </p>
                
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <code className="text-sm">fc:frame</code>
                    <p className="text-xs text-muted-foreground mt-1">Version identifier (always "vNext")</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <code className="text-sm">fc:frame:image</code>
                    <p className="text-xs text-muted-foreground mt-1">URL to the Frame's main image</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <code className="text-sm">fc:frame:button:1</code>
                    <p className="text-xs text-muted-foreground mt-1">Label for the first button (up to 4 buttons supported)</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <code className="text-sm">fc:frame:post_url</code>
                    <p className="text-xs text-muted-foreground mt-1">Endpoint to handle button interactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UX Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CHECKLIST_ITEMS.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-600 border-green-600' 
                          : 'border-muted-foreground'
                      }`}>
                        {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`text-sm ${
                        item.completed ? 'text-muted-foreground line-through' : ''
                      }`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Basic Frame
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{CODE_EXAMPLES.basic}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Advanced Frame with Multiple Buttons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{CODE_EXAMPLES.advanced}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Poll Frame
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{CODE_EXAMPLES.poll}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="best-practices" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-5 w-5" />
                    Do's
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="space-y-2 text-sm">
                    <li>✅ Use clear, actionable button labels</li>
                    <li>✅ Optimize images for fast loading</li>
                    <li>✅ Test on multiple Farcaster clients</li>
                    <li>✅ Provide immediate feedback for actions</li>
                    <li>✅ Keep the user flow simple and intuitive</li>
                    <li>✅ Use consistent branding and design</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <AlertTriangle className="h-5 w-5" />
                    Don'ts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="space-y-2 text-sm">
                    <li>❌ Don't use more than 4 buttons</li>
                    <li>❌ Don't make button labels too long</li>
                    <li>❌ Don't use low-quality or slow-loading images</li>
                    <li>❌ Don't create complex multi-step flows</li>
                    <li>❌ Don't ignore error handling</li>
                    <li>❌ Don't forget to test edge cases</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Image Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Use WebP format when possible, compress images to under 500KB, 
                      and ensure dimensions are exactly 600×400 for best results.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Response Times</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep API response times under 5 seconds. Users expect immediate 
                      feedback when interacting with Frames.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Error Handling</h4>
                    <p className="text-sm text-muted-foreground">
                      Always provide fallback images and clear error messages. 
                      Consider what happens when external services are unavailable.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Official Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://docs.farcaster.xyz/reference/frames/spec" target="_blank" rel="noopener noreferrer">
                      Farcaster Frames Specification
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://warpcast.com" target="_blank" rel="noopener noreferrer">
                      Warpcast (Test your Frames)
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://github.com/farcasterxyz/protocol" target="_blank" rel="noopener noreferrer">
                      Farcaster Protocol GitHub
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Development Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://frames.js.org" target="_blank" rel="noopener noreferrer">
                      Frames.js Framework
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://debugframes.vercel.app" target="_blank" rel="noopener noreferrer">
                      Frame Debugger
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Link href="/builder">
                    <Button variant="outline" className="w-full justify-between">
                      FrameStore Builder
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://discord.gg/farcaster" target="_blank" rel="noopener noreferrer">
                      Farcaster Discord
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://t.me/farcasterdev" target="_blank" rel="noopener noreferrer">
                      Developer Telegram
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <a href="https://github.com/farcasterxyz/frames" target="_blank" rel="noopener noreferrer">
                      Frame Examples
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inspiration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Badge variant="secondary">Popular Frame Types</Badge>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• NFT Minting Frames</li>
                      <li>• Governance Voting</li>
                      <li>• Social Games</li>
                      <li>• Event Management</li>
                      <li>• E-commerce</li>
                      <li>• Content Curation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}