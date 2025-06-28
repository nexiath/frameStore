'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, CheckCircle, Star, Zap, Crown } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const PRICING_TIERS = [
  {
    name: 'Basic Frame',
    price: '€200',
    icon: Zap,
    features: [
      'Custom Frame design',
      'Up to 2 buttons',
      'Basic functionality',
      '1 revision included',
      '48h delivery'
    ],
    popular: false
  },
  {
    name: 'Advanced Frame',
    price: '€500',
    icon: Star,
    features: [
      'Complex Frame logic',
      'Up to 4 buttons',
      'API integrations',
      'Custom backend',
      '3 revisions included',
      '72h delivery',
      'Analytics setup'
    ],
    popular: true
  },
  {
    name: 'Enterprise Frame',
    price: '€1000+',
    icon: Crown,
    features: [
      'Multi-step Frame flows',
      'Smart contract integration',
      'Custom branding',
      'Full testing suite',
      'Unlimited revisions',
      '1 week delivery',
      'Ongoing support'
    ],
    popular: false
  }
];

export default function HirePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
    budget: '',
    timeline: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    toast.success('Request Sent!', {
      description: 'I\'ll get back to you within 24 hours',
      duration: 5000,
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      project: '',
      budget: '',
      timeline: '',
      description: ''
    });
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
        <div>
          <h1 className="text-3xl font-bold">Hire Me</h1>
          <p className="text-muted-foreground">Let's build something amazing together</p>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
          Custom Frame Development
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          I specialize in creating high-performance, engaging Farcaster Frames that drive results. 
          From simple interactions to complex Web3 integrations, I'll bring your vision to life.
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>50+ Frames Built</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>98% Client Satisfaction</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>24h Response Time</span>
          </div>
        </div>
      </motion.section>

      {/* Pricing */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Pricing Plans</h3>
          <p className="text-muted-foreground">Choose the perfect plan for your project</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <Card className={`relative h-full ${
                tier.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border'
              }`}>
                {tier.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <tier.icon className={`h-8 w-8 ${
                      tier.popular ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold">{tier.price}</div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => {
                      handleInputChange('budget', tier.name);
                      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Form */}
      <motion.section 
        id="contact-form"
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Start Your Project</h3>
          <p className="text-muted-foreground">Tell me about your Frame idea and let's make it happen</p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Project Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your company"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="Basic Frame">€200 - Basic Frame</option>
                    <option value="Advanced Frame">€500 - Advanced Frame</option>
                    <option value="Enterprise Frame">€1000+ - Enterprise Frame</option>
                    <option value="Custom">Custom - Let's discuss</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project Type</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.project}
                    onChange={(e) => handleInputChange('project', e.target.value)}
                  >
                    <option value="">Select project type</option>
                    <option value="NFT Mint">NFT Minting Frame</option>
                    <option value="DAO Vote">DAO Voting Frame</option>
                    <option value="DeFi">DeFi Integration</option>
                    <option value="Poll">Poll/Survey Frame</option>
                    <option value="RSVP">Event RSVP Frame</option>
                    <option value="Custom">Custom Frame</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                  >
                    <option value="">Select timeline</option>
                    <option value="ASAP">ASAP (Rush fee applies)</option>
                    <option value="1 week">Within 1 week</option>
                    <option value="2 weeks">Within 2 weeks</option>
                    <option value="1 month">Within 1 month</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your Frame idea, target audience, key features, and any specific requirements..."
                  rows={5}
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Project Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.section>

      {/* Why Choose Me */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Why Choose Me?</h3>
          <p className="text-muted-foreground">What sets my Frame development apart</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Web3 Expertise',
              description: 'Deep knowledge of blockchain, smart contracts, and DeFi protocols',
              icon: '🔗'
            },
            {
              title: 'Performance Focus',
              description: 'Optimized for speed, reliability, and seamless user experience',
              icon: '⚡'
            },
            {
              title: 'Modern Stack',
              description: 'Latest technologies including Next.js, TypeScript, and Wagmi',
              icon: '🚀'
            },
            {
              title: 'Full Support',
              description: 'Ongoing maintenance, updates, and technical support included',
              icon: '🛠️'
            }
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            >
              <Card className="text-center h-full">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h4 className="font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}