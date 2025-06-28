'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getFrames, getUserFrames, saveFrame, likeFrame, deleteFrame, Frame } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useFrames() {
  const { data: frames, error, mutate } = useSWR('frames', () => getFrames(50, 0));

  return {
    frames: frames || [],
    isLoading: !error && !frames,
    isError: error,
    refresh: mutate,
  };
}

export function useUserFrames() {
  const { authState } = useAuth();
  const { data: frames, error, mutate } = useSWR(
    authState.user ? ['user-frames', authState.user.id] : null,
    () => getUserFrames(authState.user.id)
  );

  return {
    frames: frames || [],
    isLoading: !error && !frames && authState.user,
    isError: error,
    refresh: mutate,
  };
}

export function useFrameActions() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createFrame = async (frameData: {
    title: string;
    description: string;
    image_url: string;
    button1_label: string;
    button1_target: string;
    json_full: any;
  }) => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to create frames');
      return null;
    }

    setIsLoading(true);
    try {
      const frame = await saveFrame({
        ...frameData,
        user_id: authState.user.id,
      });

      toast.success('Frame created successfully!', {
        description: 'Your frame has been saved to the gallery',
      });

      return frame;
    } catch (error) {
      console.error('Error creating frame:', error);
      toast.error('Failed to create frame', {
        description: 'Please try again',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (frameId: string) => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to like frames');
      return false;
    }

    try {
      const liked = await likeFrame(frameId, authState.user.id);
      toast.success(liked ? 'Frame liked!' : 'Frame unliked');
      return liked;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
      return false;
    }
  };

  const removeFrame = async (frameId: string) => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to delete frames');
      return false;
    }

    setIsLoading(true);
    try {
      await deleteFrame(frameId, authState.user.id);
      toast.success('Frame deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting frame:', error);
      toast.error('Failed to delete frame');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createFrame,
    toggleLike,
    removeFrame,
    isLoading,
  };
}