'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getTemplates, createTemplate, Template } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useTemplates(category?: string, featured = false) {
  const { data: templates, error, mutate } = useSWR(
    ['templates', category, featured],
    () => getTemplates(category, featured)
  );

  return {
    templates: templates || [],
    isLoading: !error && !templates,
    isError: error,
    refresh: mutate,
  };
}

export function useTemplateActions() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createNewTemplate = async (templateData: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    preview_image: string;
    template_data: any;
    price_cents?: number;
  }) => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to create templates');
      return null;
    }

    setIsLoading(true);
    try {
      const template = await createTemplate({
        ...templateData,
        creator_id: authState.user.id,
      });

      toast.success('Template created successfully!', {
        description: 'Your template is now available in the marketplace',
      });

      return template;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template', {
        description: 'Please try again',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const useTemplate = (template: Template) => {
    return {
      title: template.template_data.title || template.name,
      description: template.template_data.description || template.description,
      image_url: template.template_data.image_url || template.preview_image,
      button1_label: template.template_data.button1_label || 'Click Me',
      button1_target: template.template_data.button1_target || 'https://example.com',
      json_full: template.template_data.json_full || {},
    };
  };

  return {
    createNewTemplate,
    useTemplate,
    isLoading,
  };
}

export const TEMPLATE_CATEGORIES = [
  'NFT Mint',
  'DAO Voting',
  'DeFi',
  'Social',
  'Gaming',
  'Event',
  'Marketing',
  'Education',
  'Art',
  'Music',
  'Other'
];

export const FEATURED_TEMPLATES = [
  {
    id: 'nft-mint-basic',
    name: 'Basic NFT Mint',
    description: 'Simple NFT minting frame with price and mint button',
    category: 'NFT Mint',
    tags: ['nft', 'mint', 'basic'],
    preview_image: 'https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    template_data: {
      title: 'Mint Your NFT',
      description: 'Limited edition NFT collection - mint now!',
      image_url: 'https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      button1_label: 'Mint NFT (0.01 ETH)',
      button1_target: 'https://mint.example.com',
      json_full: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        "fc:frame:button:1": "Mint NFT (0.01 ETH)",
        "fc:frame:button:1:action": "post",
        "fc:frame:post_url": "https://mint.example.com",
        "og:title": "Mint Your NFT",
        "og:description": "Limited edition NFT collection - mint now!",
        "og:image": "https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
      }
    },
    is_featured: true,
    downloads: 1250,
    rating: 4.8
  },
  {
    id: 'dao-vote',
    name: 'DAO Governance Vote',
    description: 'Community voting frame for DAO proposals',
    category: 'DAO Voting',
    tags: ['dao', 'vote', 'governance'],
    preview_image: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    template_data: {
      title: 'DAO Proposal Vote',
      description: 'Vote on the latest community proposal',
      image_url: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      button1_label: 'Vote Yes',
      button1_target: 'https://vote.example.com/yes',
      json_full: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        "fc:frame:button:1": "Vote Yes",
        "fc:frame:button:1:action": "post",
        "fc:frame:button:2": "Vote No",
        "fc:frame:button:2:action": "post",
        "fc:frame:post_url": "https://vote.example.com",
        "og:title": "DAO Proposal Vote",
        "og:description": "Vote on the latest community proposal",
        "og:image": "https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
      }
    },
    is_featured: true,
    downloads: 890,
    rating: 4.6
  }
];