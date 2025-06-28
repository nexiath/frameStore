'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAccount, useSignMessage } from 'wagmi';
import { PenTool, Vote, FileText, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SignatureFrameProps {
  onFrameGenerated?: (frameData: any) => void;
}

const SIGNATURE_TYPES = [
  {
    id: 'vote',
    name: 'DAO Vote',
    icon: Vote,
    description: 'Create a governance vote that requires wallet signature',
    template: {
      title: 'DAO Governance Vote',
      description: 'Vote on proposal #123: Increase treasury allocation',
      message: 'I vote YES on proposal #123 to increase treasury allocation to 50%',
      buttonText: 'Sign Vote'
    }
  },
  {
    id: 'petition',
    name: 'Petition',
    icon: FileText,
    description: 'Collect signatures for a community petition',
    template: {
      title: 'Community Petition',
      description: 'Sign the petition to support decentralized social media',
      message: 'I support the development of decentralized social media platforms and commit to using them.',
      buttonText: 'Sign Petition'
    }
  },
  {
    id: 'commitment',
    name: 'Commitment',
    icon: PenTool,
    description: 'Create a commitment that users can sign',
    template: {
      title: 'Builder Commitment',
      description: 'Commit to building in public for 30 days',
      message: 'I commit to building in public and sharing my progress daily for the next 30 days.',
      buttonText: 'Make Commitment'
    }
  }
];

export function SignatureFrame({ onFrameGenerated }: SignatureFrameProps) {
  const { address, isConnected } = useAccount();
  const { signMessage, data: signature, isPending } = useSignMessage();

  const [selectedType, setSelectedType] = useState(SIGNATURE_TYPES[0]);
  const [frameData, setFrameData] = useState(selectedType.template);
  const [signatures, setSignatures] = useState<Array<{
    address: string;
    signature: string;
    timestamp: Date;
  }>>([]);

  const handleSign = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const messageToSign = `${frameData.message}\n\nSigned by: ${address}\nTimestamp: ${new Date().toISOString()}`;
      
      await signMessage({
        message: messageToSign,
      });

      // Add signature to local state (in real app, this would go to backend)
      setSignatures(prev => [...prev, {
        address,
        signature: signature || 'pending',
        timestamp: new Date()
      }]);

      toast.success('Message signed successfully!', {
        description: 'Your signature has been recorded',
      });
    } catch (error) {
      console.error('Signing error:', error);
      toast.error('Signing failed', {
        description: 'Please try again',
      });
    }
  };

  const generateSignatureFrame = () => {
    const signatureFrameJSON = {
      "fc:frame": "vNext",
      "fc:frame:image": `https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop`,
      "fc:frame:button:1": frameData.buttonText,
      "fc:frame:button:1:action": "post",
      "fc:frame:button:2": "View Signatures",
      "fc:frame:button:2:action": "link",
      "fc:frame:button:2:target": `https://framestore.app/signatures/${selectedType.id}`,
      "fc:frame:post_url": `https://api.framestore.app/sign/${selectedType.id}`,
      "fc:frame:input:text": "Optional: Add your comment",
      "og:title": frameData.title,
      "og:description": frameData.description,
      "og:image": `https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop`
    };

    if (onFrameGenerated) {
      onFrameGenerated({
        ...frameData,
        image_url: `https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop`,
        button1_label: frameData.buttonText,
        button1_target: `https://api.framestore.app/sign/${selectedType.id}`,
        json_full: signatureFrameJSON,
        type: 'signature'
      });
    }

    toast.success('Signature Frame Generated!', {
      description: 'Your Frame is ready for deployment',
      duration: 3000,
    });
  };

  const copySignature = (sig: string) => {
    navigator.clipboard.writeText(sig);
    toast.success('Signature copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-blue-600" />
            Signature Frame Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label>Signature Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SIGNATURE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedType.id === type.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => {
                      setSelectedType(type);
                      setFrameData(type.template);
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold text-sm">{type.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Frame Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frame-title">Frame Title</Label>
              <Input
                id="frame-title"
                value={frameData.title}
                onChange={(e) => setFrameData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter frame title..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frame-description">Frame Description</Label>
              <Textarea
                id="frame-description"
                value={frameData.description}
                onChange={(e) => setFrameData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what users are signing..."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signature-message">Message to Sign</Label>
              <Textarea
                id="signature-message"
                value={frameData.message}
                onChange={(e) => setFrameData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="The message users will sign with their wallet..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={frameData.buttonText}
                onChange={(e) => setFrameData(prev => ({ ...prev, buttonText: e.target.value }))}
                placeholder="Sign Vote"
              />
            </div>
          </div>

          {/* Test Signature */}
          <div className="border rounded-lg p-4 space-y-3">
            <Label className="text-sm font-medium">Test Signature Function</Label>
            {isConnected ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <Button
                  onClick={handleSign}
                  disabled={isPending}
                  className="w-full gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4" />
                      {frameData.buttonText}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                Connect your wallet to test signing
              </div>
            )}
          </div>

          {/* Signatures List */}
          {signatures.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Collected Signatures</Label>
                <Badge variant="secondary">{signatures.length} signatures</Badge>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {signatures.map((sig, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-muted p-2 rounded">
                    <div>
                      <div className="font-mono">{sig.address.slice(0, 8)}...{sig.address.slice(-6)}</div>
                      <div className="text-muted-foreground">{sig.timestamp.toLocaleString()}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copySignature(sig.signature)}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate Frame */}
          <Button
            onClick={generateSignatureFrame}
            className="w-full gap-2"
            size="lg"
          >
            <PenTool className="h-4 w-4" />
            Generate Signature Frame
          </Button>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
            <strong>📝 How it works:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Users click the Frame button in Farcaster</li>
              <li>They're prompted to sign the message with their wallet</li>
              <li>Signatures are collected and can be verified on-chain</li>
              <li>Perfect for governance, petitions, and commitments</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}