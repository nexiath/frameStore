import { SiweMessage } from 'siwe';
import { supabase, signInWithWallet } from './supabase';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  walletAddress: string | null;
}

// Generate SIWE message
export function createSiweMessage(address: string, statement: string) {
  const domain = typeof window !== 'undefined' ? window.location.host : 'framestore.app';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://framestore.app';
  
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1,
    nonce: generateNonce(),
  });

  return message.prepareMessage();
}

// Generate random nonce
function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Verify SIWE signature and authenticate user
export async function authenticateWithSiwe(
  message: string,
  signature: string,
  address: string
) {
  try {
    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });

    if (result.success) {
      // Sign in with Supabase
      const user = await signInWithWallet(address, signature, message);
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid signature' };
    }
  } catch (error) {
    console.error('SIWE verification failed:', error);
    return { success: false, error: 'Verification failed' };
  }
}

// Local storage helpers
export function saveAuthState(authState: AuthState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('framestore_auth', JSON.stringify(authState));
  }
}

export function loadAuthState(): AuthState | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('framestore_auth');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function clearAuthState() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('framestore_auth');
  }
}