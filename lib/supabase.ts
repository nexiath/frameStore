import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced types for new features
export interface User {
  id: string;
  wallet_address: string;
  created_at: string;
}

export interface Frame {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
  json_full: any;
  likes: number;
  created_at: string;
  user?: User;
  current_version?: FrameVersion;
  versions?: FrameVersion[];
  analytics?: FrameAnalytics;
  translations?: FrameTranslation[];
}

export interface FrameVersion {
  id: string;
  frame_id: string;
  parent_version_id?: string;
  version_number: number;
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
  json_full: any;
  is_current: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  frame_id?: string;
  type: 'milestone' | 'collaboration' | 'system' | 'achievement';
  title: string;
  message: string;
  data: any;
  read: boolean;
  email_sent: boolean;
  created_at: string;
  frame?: Frame;
}

export interface ScheduledFrame {
  id: string;
  frame_id: string;
  user_id: string;
  publish_at: string;
  status: 'pending' | 'published' | 'cancelled';
  platform: 'warpcast' | 'farcaster';
  auto_post: boolean;
  created_at: string;
  frame?: Frame;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  slug: string;
  settings: any;
  created_at: string;
  owner?: User;
  members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  invited_by?: string;
  joined_at: string;
  user?: User;
  workspace?: Workspace;
}

export interface Template {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  preview_image: string;
  template_data: any;
  is_public: boolean;
  is_featured: boolean;
  price_cents: number;
  downloads: number;
  rating: number;
  created_at: string;
  creator?: User;
}

export interface AnalyticsEvent {
  id: string;
  frame_id: string;
  event_type: 'view' | 'click' | 'share' | 'like' | 'comment';
  user_agent?: string;
  ip_address?: string;
  country?: string;
  coordinates?: [number, number];
  metadata: any;
  created_at: string;
}

export interface FrameAnalytics {
  total_views: number;
  total_clicks: number;
  total_shares: number;
  ctr: number;
  top_countries: Array<{ country: string; count: number }>;
  daily_stats: Array<{ date: string; views: number; clicks: number }>;
  click_heatmap: Array<{ x: number; y: number; count: number }>;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_data: any;
  earned_at: string;
}

export interface FrameTranslation {
  id: string;
  frame_id: string;
  language_code: string;
  title: string;
  description: string;
  button_labels: any;
  auto_generated: boolean;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  frame_id: string;
  created_at: string;
}

// Enhanced frame functions
export async function saveFrame(frameData: {
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
  json_full: any;
  user_id: string;
}) {
  try {
    const { data, error } = await supabase
      .from('frames')
      .insert([frameData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving frame:', error);
    throw error;
  }
}

export async function getFrames(limit = 20, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('frames')
      .select(`
        *,
        user:users(wallet_address)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching frames:', error);
    throw error;
  }
}

export async function getUserFrames(userId: string) {
  try {
    const { data, error } = await supabase
      .from('frames')
      .select(`
        *,
        versions:frame_versions(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user frames:', error);
    throw error;
  }
}

// Frame versioning functions
export async function createFrameVersion(frameId: string, versionData: {
  title: string;
  description: string;
  image_url: string;
  button1_label: string;
  button1_target: string;
  json_full: any;
}) {
  try {
    const { data, error } = await supabase.rpc('create_frame_version', {
      p_frame_id: frameId,
      p_title: versionData.title,
      p_description: versionData.description,
      p_image_url: versionData.image_url,
      p_button1_label: versionData.button1_label,
      p_button1_target: versionData.button1_target,
      p_json_full: versionData.json_full
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating frame version:', error);
    throw error;
  }
}

export async function setCurrentFrameVersion(versionId: string) {
  try {
    const { error } = await supabase.rpc('set_current_frame_version', {
      p_version_id: versionId
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting current frame version:', error);
    throw error;
  }
}

export async function getFrameVersions(frameId: string) {
  try {
    const { data, error } = await supabase
      .from('frame_versions')
      .select('*')
      .eq('frame_id', frameId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching frame versions:', error);
    throw error;
  }
}

// Notification functions
export async function getUserNotifications(userId: string, unreadOnly = false) {
  try {
    let query = supabase
      .from('notifications')
      .select(`
        *,
        frame:frames(title, image_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Scheduled frames functions
export async function scheduleFrame(frameId: string, userId: string, publishAt: string, platform = 'warpcast') {
  try {
    const { data, error } = await supabase
      .from('scheduled_frames')
      .insert([{
        frame_id: frameId,
        user_id: userId,
        publish_at: publishAt,
        platform
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error scheduling frame:', error);
    throw error;
  }
}

export async function getUserScheduledFrames(userId: string) {
  try {
    const { data, error } = await supabase
      .from('scheduled_frames')
      .select(`
        *,
        frame:frames(title, image_url)
      `)
      .eq('user_id', userId)
      .order('publish_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching scheduled frames:', error);
    throw error;
  }
}

// Workspace functions
export async function createWorkspace(workspaceData: {
  name: string;
  description?: string;
  slug: string;
  owner_id: string;
}) {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .insert([workspaceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
}

export async function getUserWorkspaces(userId: string) {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select(`
        *,
        members:workspace_members(
          *,
          user:users(wallet_address)
        )
      `)
      .or(`owner_id.eq.${userId},members.user_id.eq.${userId}`);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user workspaces:', error);
    throw error;
  }
}

// Template functions
export async function getTemplates(category?: string, featured = false) {
  try {
    let query = supabase
      .from('templates')
      .select(`
        *,
        creator:users(wallet_address)
      `)
      .eq('is_public', true)
      .order('downloads', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

export async function createTemplate(templateData: {
  name: string;
  description: string;
  category: string;
  tags: string[];
  preview_image: string;
  template_data: any;
  creator_id: string;
  price_cents?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('templates')
      .insert([templateData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
}

// Analytics functions
export async function trackAnalyticsEvent(eventData: {
  frame_id: string;
  event_type: 'view' | 'click' | 'share' | 'like' | 'comment';
  user_agent?: string;
  ip_address?: string;
  country?: string;
  coordinates?: [number, number];
  metadata?: any;
}) {
  try {
    // Check if analytics_events table exists by trying to query it first
    const { error: checkError } = await supabase
      .from('analytics_events')
      .select('id')
      .limit(1);

    // If table doesn't exist, return false silently
    if (checkError && checkError.code === 'PGRST116') {
      console.warn('Analytics events table not found, skipping analytics tracking');
      return false;
    }

    const { error } = await supabase
      .from('analytics_events')
      .insert([eventData]);

    if (error) {
      console.error('Analytics tracking error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return false;
  }
}

export async function getFrameAnalytics(frameId: string, days = 30): Promise<FrameAnalytics> {
  try {
    // Check if analytics_events table exists
    const { error: checkError } = await supabase
      .from('analytics_events')
      .select('id')
      .limit(1);

    // If table doesn't exist, return empty analytics
    if (checkError && checkError.code === 'PGRST116') {
      return {
        total_views: 0,
        total_clicks: 0,
        total_shares: 0,
        ctr: 0,
        top_countries: [],
        daily_stats: [],
        click_heatmap: []
      };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('frame_id', frameId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Process analytics data
    const events = data || [];
    const views = events.filter(e => e.event_type === 'view').length;
    const clicks = events.filter(e => e.event_type === 'click').length;
    const shares = events.filter(e => e.event_type === 'share').length;

    // Calculate CTR
    const ctr = views > 0 ? (clicks / views) * 100 : 0;

    // Group by country
    const countryStats = events.reduce((acc, event) => {
      if (event.country) {
        acc[event.country] = (acc[event.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryStats)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Daily stats
    const dailyStats = events.reduce((acc, event) => {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, views: 0, clicks: 0 };
      }
      if (event.event_type === 'view') acc[date].views++;
      if (event.event_type === 'click') acc[date].clicks++;
      return acc;
    }, {} as Record<string, any>);

    // Click heatmap
    const clickEvents = events.filter(e => e.event_type === 'click' && e.coordinates);
    const clickHeatmap = clickEvents.map(e => ({
      x: e.coordinates[0],
      y: e.coordinates[1],
      count: 1
    }));

    return {
      total_views: views,
      total_clicks: clicks,
      total_shares: shares,
      ctr,
      top_countries: topCountries,
      daily_stats: Object.values(dailyStats),
      click_heatmap: clickHeatmap
    };
  } catch (error) {
    console.error('Error fetching frame analytics:', error);
    // Return empty analytics instead of throwing
    return {
      total_views: 0,
      total_clicks: 0,
      total_shares: 0,
      ctr: 0,
      top_countries: [],
      daily_stats: [],
      click_heatmap: []
    };
  }
}

// User achievements functions
export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
}

// Frame translations functions
export async function createFrameTranslation(translationData: {
  frame_id: string;
  language_code: string;
  title: string;
  description: string;
  button_labels: any;
  auto_generated?: boolean;
}) {
  try {
    const { data, error } = await supabase
      .from('frame_translations')
      .insert([translationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating frame translation:', error);
    throw error;
  }
}

export async function getFrameTranslations(frameId: string) {
  try {
    const { data, error } = await supabase
      .from('frame_translations')
      .select('*')
      .eq('frame_id', frameId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching frame translations:', error);
    throw error;
  }
}

// Existing functions remain the same
export async function signInWithWallet(walletAddress: string, signature: string, message: string) {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (!existingUser) {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ wallet_address: walletAddress }])
        .select()
        .single();

      if (error) throw error;
      return newUser;
    }

    return existingUser;
  } catch (error) {
    console.error('Error signing in with wallet:', error);
    throw error;
  }
}

export async function likeFrame(frameId: string, userId: string) {
  try {
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('frame_id', frameId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      await supabase
        .from('likes')
        .delete()
        .eq('frame_id', frameId)
        .eq('user_id', userId);

      await supabase.rpc('decrement_likes', { frame_id: frameId });
      return false;
    } else {
      await supabase
        .from('likes')
        .insert([{ frame_id: frameId, user_id: userId }]);

      await supabase.rpc('increment_likes', { frame_id: frameId });
      
      // Track analytics event
      await trackAnalyticsEvent({
        frame_id: frameId,
        event_type: 'like'
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error liking frame:', error);
    throw error;
  }
}

export async function deleteFrame(frameId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('frames')
      .delete()
      .eq('id', frameId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting frame:', error);
    throw error;
  }
}

export async function updateFrame(frameId: string, userId: string, updates: Partial<Frame>) {
  try {
    const { data, error } = await supabase
      .from('frames')
      .update(updates)
      .eq('id', frameId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating frame:', error);
    throw error;
  }
}