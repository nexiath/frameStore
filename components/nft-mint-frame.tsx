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
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Coins, Zap, ExternalLink, Copy, Wallet, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface NFTMintFrameProps {
  onFrameGenerated?: (frameData: any) => void;
}

// Mock NFT contract ABI (simplified)
const NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenURI', type: 'string' }
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }]
  },
  {
    name: 'mintPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

// Mock contract addresses for different chains
const CONTRACTS = {
  base: '0x1234567890123456789012345678901234567890',
  ethereum: '0x0987654321098765432109876543210987654321',
  polygon: '0x1111111111111111111111111111111111111111'
};

export function NFTMintFrame({ onFrameGenerated }: NFTMintFrameProps) {
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [nftData, setNftData] = useState({
    name: 'Exclusive Frame NFT',
    description: 'A unique NFT minted directly from a Farcaster Frame',
    image: 'https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: '0.001',
    supply: '100',
    chain: 'base'
  });

  const [frameData, setFrameData] = useState({
    title: 'Mint Exclusive NFT',
    description: 'Limited edition NFT collection - mint directly from this Frame!',
    buttonText: 'Mint NFT (0.001 ETH)'
  });

  const handleMint = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const contractAddress = CONTRACTS[nftData.chain as keyof typeof CONTRACTS];
      const mintPrice = parseEther(nftData.price);

      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [address, `ipfs://metadata-hash-for-${nftData.name}`],
        value: mintPrice,
      });

      toast.success('Mint transaction submitted!', {
        description: 'Please wait for confirmation...',
      });
    } catch (error) {
      console.error('Mint error:', error);
      toast.error('Mint failed', {
        description: 'Please try again or check your wallet',
      });
    }
  };

  const generateMintFrame = () => {
    const mintFrameJSON = {
      "fc:frame": "vNext",
      "fc:frame:image": nftData.image,
      "fc:frame:button:1": frameData.buttonText,
      "fc:frame:button:1:action": "post",
      "fc:frame:button:2": "View Collection",
      "fc:frame:button:2:action": "link",
      "fc:frame:button:2:target": `https://opensea.io/collection/${nftData.name.toLowerCase().replace(/\s+/g, '-')}`,
      "fc:frame:post_url": `https://api.framestore.app/mint/${CONTRACTS[nftData.chain as keyof typeof CONTRACTS]}`,
      "fc:frame:input:text": "Enter quantity (max 5)",
      "og:title": frameData.title,
      "og:description": frameData.description,
      "og:image": nftData.image
    };

    if (onFrameGenerated) {
      onFrameGenerated({
        ...frameData,
        image_url: nftData.image,
        button1_label: frameData.buttonText,
        button1_target: `https://api.framestore.app/mint/${CONTRACTS[nftData.chain as keyof typeof CONTRACTS]}`,
        json_full: mintFrameJSON,
        type: 'nft-mint'
      });
    }

    toast.success('NFT Mint Frame Generated!', {
      description: 'Your Frame is ready for deployment',
      duration: 3000,
    });
  };

  const copyContractAddress = () => {
    const contractAddress = CONTRACTS[nftData.chain as keyof typeof CONTRACTS];
    navigator.clipboard.writeText(contractAddress);
    toast.success('Contract address copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-green-600" />
            NFT Mint Frame Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configure">Configure NFT</TabsTrigger>
              <TabsTrigger value="frame">Frame Settings</TabsTrigger>
              <TabsTrigger value="deploy">Deploy & Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="configure" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nft-name">NFT Collection Name</Label>
                  <Input
                    id="nft-name"
                    value={nftData.name}
                    onChange={(e) => setNftData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Awesome NFT Collection"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nft-price">Mint Price (ETH)</Label>
                  <Input
                    id="nft-price"
                    type="number"
                    step="0.001"
                    value={nftData.price}
                    onChange={(e) => setNftData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.001"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nft-description">Description</Label>
                <Textarea
                  id="nft-description"
                  value={nftData.description}
                  onChange={(e) => setNftData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your NFT collection..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nft-supply">Total Supply</Label>
                  <Input
                    id="nft-supply"
                    type="number"
                    value={nftData.supply}
                    onChange={(e) => setNftData(prev => ({ ...prev, supply: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Blockchain</Label>
                  <div className="flex gap-2">
                    {Object.keys(CONTRACTS).map((chainName) => (
                      <Badge
                        key={chainName}
                        variant={nftData.chain === chainName ? "default" : "secondary"}
                        className="cursor-pointer transition-all hover:scale-105 capitalize"
                        onClick={() => setNftData(prev => ({ ...prev, chain: chainName }))}
                      >
                        {chainName}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nft-image">NFT Image URL</Label>
                <Input
                  id="nft-image"
                  value={nftData.image}
                  onChange={(e) => setNftData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/nft-image.png"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="frame" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="frame-title">Frame Title</Label>
                <Input
                  id="frame-title"
                  value={frameData.title}
                  onChange={(e) => setFrameData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Mint Exclusive NFT"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frame-description">Frame Description</Label>
                <Textarea
                  id="frame-description"
                  value={frameData.description}
                  onChange={(e) => setFrameData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what users will see in the Frame..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button-text">Mint Button Text</Label>
                <Input
                  id="button-text"
                  value={frameData.buttonText}
                  onChange={(e) => setFrameData(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Mint NFT (0.001 ETH)"
                />
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-white/50 dark:bg-black/20">
                <Label className="text-sm font-medium mb-2 block">Frame Preview</Label>
                <div className="aspect-[3/2] relative rounded-lg overflow-hidden border">
                  <img
                    src={nftData.image}
                    alt="NFT Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold">{frameData.title}</h3>
                    <p className="text-white/80 text-sm">{nftData.price} ETH</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="deploy" className="space-y-4 mt-6">
              {/* Contract Info */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Contract Address ({nftData.chain})</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyContractAddress}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <code className="text-xs bg-muted p-2 rounded block">
                  {CONTRACTS[nftData.chain as keyof typeof CONTRACTS]}
                </code>
              </div>

              {/* Test Mint */}
              <div className="border rounded-lg p-4 space-y-3">
                <Label className="text-sm font-medium">Test Mint Function</Label>
                {isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wallet className="h-4 w-4" />
                      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                    <Button
                      onClick={handleMint}
                      disabled={isPending || isConfirming}
                      className="w-full gap-2"
                    >
                      {isPending || isConfirming ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          {isPending ? 'Confirming...' : 'Minting...'}
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Test Mint ({nftData.price} ETH)
                        </>
                      )}
                    </Button>
                    {isSuccess && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Mint successful! 
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto gap-1"
                          asChild
                        >
                          <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                            View on Etherscan
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    Connect your wallet to test minting
                  </div>
                )}
              </div>

              {/* Generate Frame */}
              <Button
                onClick={generateMintFrame}
                className="w-full gap-2"
                size="lg"
              >
                <Coins className="h-4 w-4" />
                Generate NFT Mint Frame
              </Button>

              {/* Instructions */}
              <div className="text-xs text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                <strong>🚀 Next Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Deploy your NFT contract to the selected blockchain</li>
                  <li>Update the contract address in your Frame JSON</li>
                  <li>Set up a backend endpoint to handle mint requests</li>
                  <li>Test the Frame in Warpcast or Frame debugger</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}