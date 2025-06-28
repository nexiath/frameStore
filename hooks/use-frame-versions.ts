'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { 
  getFrameVersions, 
  createFrameVersion, 
  setCurrentFrameVersion,
  FrameVersion 
} from '@/lib/supabase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useFrameVersions(frameId: string) {
  const { authState } = useAuth();
  const { data: versions, error, mutate } = useSWR(
    frameId ? ['frame-versions', frameId] : null,
    () => getFrameVersions(frameId)
  );

  const [isLoading, setIsLoading] = useState(false);

  const createVersion = async (versionData: {
    title: string;
    description: string;
    image_url: string;
    button1_label: string;
    button1_target: string;
    json_full: any;
  }) => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to create versions');
      return null;
    }

    setIsLoading(true);
    try {
      const versionId = await createFrameVersion(frameId, versionData);
      mutate(); // Refresh versions
      return versionId;
    } catch (error) {
      console.error('Error creating version:', error);
      toast.error('Failed to create version');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentVersion = async (versionId: string) => {
    setIsLoading(true);
    try {
      await setCurrentFrameVersion(versionId);
      mutate(); // Refresh versions
      return true;
    } catch (error) {
      console.error('Error setting current version:', error);
      toast.error('Failed to set current version');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    versions: versions || [],
    isLoading: isLoading || (!error && !versions && frameId),
    isError: error,
    createVersion,
    setCurrentVersion,
    refresh: mutate,
  };
}