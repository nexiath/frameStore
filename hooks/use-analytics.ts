'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getFrameAnalytics, trackAnalyticsEvent, FrameAnalytics } from '@/lib/supabase';
import { toast } from 'sonner';

export function useFrameAnalytics(frameId: string, days = 30) {
  const { data: analytics, error, mutate } = useSWR(
    frameId ? ['analytics', frameId, days] : null,
    () => getFrameAnalytics(frameId, days)
  );

  return {
    analytics: analytics || null,
    isLoading: !error && !analytics && frameId,
    isError: error,
    refresh: mutate,
  };
}

export function useAnalyticsTracking() {
  const trackEvent = async (eventData: {
    frame_id: string;
    event_type: 'view' | 'click' | 'share' | 'like' | 'comment';
    coordinates?: [number, number];
    metadata?: any;
  }) => {
    try {
      // Only execute on client side
      if (typeof window === 'undefined') {
        return false;
      }
      
      // Get user location and device info
      const userAgent = navigator.userAgent;
      
      // Get IP and country (in production, you'd use a service like ipapi.co)
      let country = 'Unknown';
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        country = data.country_name || 'Unknown';
      } catch (e) {
        // Fallback to browser language
        country = navigator.language.split('-')[1] || 'Unknown';
      }

      const success = await trackAnalyticsEvent({
        ...eventData,
        user_agent: userAgent,
        country,
      });

      if (!success) {
        console.warn('Analytics tracking failed silently');
      }

      return success;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      // Don't throw the error to prevent breaking the UI
      return false;
    }
  };

  const trackFrameView = (frameId: string) => {
    if (!frameId) return;
    trackEvent({
      frame_id: frameId,
      event_type: 'view'
    });
  };

  const trackFrameClick = (frameId: string, coordinates?: [number, number]) => {
    if (!frameId) return;
    trackEvent({
      frame_id: frameId,
      event_type: 'click',
      coordinates
    });
  };

  const trackFrameShare = (frameId: string, platform?: string) => {
    if (!frameId) return;
    trackEvent({
      frame_id: frameId,
      event_type: 'share',
      metadata: { platform }
    });
  };

  return {
    trackEvent,
    trackFrameView,
    trackFrameClick,
    trackFrameShare,
  };
}

export function useClickHeatmap(frameId: string) {
  const [clickData, setClickData] = useState<Array<{ x: number; y: number; count: number }>>([]);
  const { analytics } = useFrameAnalytics(frameId);

  useEffect(() => {
    if (analytics?.click_heatmap) {
      // Process click heatmap data
      const heatmapData = analytics.click_heatmap.reduce((acc, click) => {
        const key = `${click.x}-${click.y}`;
        acc[key] = (acc[key] || 0) + click.count;
        return acc;
      }, {} as Record<string, number>);

      const processedData = Object.entries(heatmapData).map(([key, count]) => {
        const [x, y] = key.split('-').map(Number);
        return { x, y, count };
      });

      setClickData(processedData);
    }
  }, [analytics]);

  return clickData;
}