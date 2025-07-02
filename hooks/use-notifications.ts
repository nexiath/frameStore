'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getUserNotifications, markNotificationAsRead, Notification, supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useNotifications() {
  const { authState } = useAuth();
  const { data: notifications, error, mutate } = useSWR(
    authState.user ? ['notifications', authState.user.id] : null,
    () => getUserNotifications(authState.user.id)
  );

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      mutate(); // Refresh notifications
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications?.filter(n => !n.read) || [];
      await Promise.all(
        unreadNotifications.map(n => markNotificationAsRead(n.id))
      );
      mutate(); // Refresh notifications
      toast.success('All notifications marked as read');
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
      return false;
    }
  };

  return {
    notifications: notifications || [],
    unreadCount,
    isLoading: !error && !notifications && authState.user,
    isError: error,
    markAsRead,
    markAllAsRead,
    refresh: mutate,
  };
}

export function useRealtimeNotifications() {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!authState.user) return;

    // Set up real-time subscription for notifications
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${authState.user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast notification
          toast.info(newNotification.title, {
            description: newNotification.message,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [authState.user]);

  return notifications;
}