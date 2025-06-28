'use client';

import { useState } from 'react';
import { useAnalyticsTracking } from './use-analytics';

interface FrameData {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
  json_full?: any;
}

export function useFramePreview() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<FrameData | null>(null);
  const [previewJson, setPreviewJson] = useState<string>('');
  const { trackFrameView } = useAnalyticsTracking();

  const openPreview = (frameData: FrameData, frameJson?: string) => {
    setPreviewData(frameData);
    setPreviewJson(frameJson || '');
    setIsPreviewOpen(true);
    
    // Track preview open
    if (frameData.id) {
      trackFrameView(frameData.id);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewData(null);
    setPreviewJson('');
  };

  return {
    isPreviewOpen,
    previewData,
    previewJson,
    openPreview,
    closePreview,
  };
}

export function useFrameInteraction() {
  const { trackFrameClick } = useAnalyticsTracking();

  const handleButtonClick = (frameId: string, buttonIndex: number, coordinates?: [number, number]) => {
    // Track the click
    trackFrameClick(frameId, coordinates);
    
    // In a real implementation, this would:
    // 1. Send POST request to frame's post_url
    // 2. Handle the response
    // 3. Update the frame state
    
    console.log(`Button ${buttonIndex} clicked on frame ${frameId}`);
  };

  const simulateFrameInteraction = (frameData: FrameData) => {
    if (frameData.id) {
      handleButtonClick(frameData.id, 1);
    }
    
    // Simulate button action
    if (frameData.button1_target) {
      window.open(frameData.button1_target, '_blank');
    }
  };

  return {
    handleButtonClick,
    simulateFrameInteraction,
  };
}