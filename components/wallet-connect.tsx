'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { authState, signIn, signOut, isLoading } = useAuth();

  const handleConnect = async () => {
    try {
      const connector = connectors[0]; // Use first available connector
      if (connector) {
        connect({ connector });
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    signOut();
  };

  const handleSignIn = async () => {
    if (!isConnected) {
      await handleConnect();
      return;
    }
    await signIn();
  };

  // Auto sign in when wallet connects
  useEffect(() => {
    if (isConnected && address && !authState.isAuthenticated) {
      // Auto-trigger sign in after wallet connection
      const timer = setTimeout(() => {
        signIn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, authState.isAuthenticated]);

  if (authState.isAuthenticated && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Signed In
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDisconnect}
                className="h-8 px-2"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isConnected && address && !authState.isAuthenticated) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Badge variant="outline" className="text-xs">
                Connected
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={handleSignIn}
              disabled={isLoading}
              className="h-8 px-3"
            >
              {isLoading ? 'Signing...' : 'Sign In'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="gap-2"
      variant="outline"
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}