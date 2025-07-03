'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { AuthState, createSiweMessage, authenticateWithSiwe, saveAuthState, loadAuthState, clearAuthState } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  authState: AuthState;
  signIn: () => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthState() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    walletAddress: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load auth state on mount
  useEffect(() => {
    // Only execute on client side
    if (typeof window === 'undefined') {
      return;
    }
    
    const stored = loadAuthState();
    if (stored && stored.walletAddress === address) {
      setAuthState(stored);
    }
  }, [address]);

  const signIn = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const statement = 'Sign in to FrameStore to create and manage your Farcaster Frames.';
      const message = createSiweMessage(address, statement);
      
      const signature = await signMessageAsync({ message });
      
      const result = await authenticateWithSiwe(message, signature, address);
      
      if (result.success) {
        const newAuthState: AuthState = {
          isAuthenticated: true,
          user: result.user,
          walletAddress: address,
        };
        
        setAuthState(newAuthState);
        saveAuthState(newAuthState);
        
        toast.success('Successfully signed in!', {
          description: `Welcome ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } else {
        toast.error('Sign in failed', {
          description: result.error || 'Please try again',
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed', {
        description: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      walletAddress: null,
    });
    clearAuthState();
    toast.info('Signed out successfully');
  };

  return {
    authState,
    signIn,
    signOut,
    isLoading,
  };
}

// Export the context for the provider
export { AuthContext };