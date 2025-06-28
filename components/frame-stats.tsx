'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, MousePointer, Users, Flame } from 'lucide-react';

interface FrameStatsProps {
  impressions: number;
  clicks: number;
  ctr: number;
  users: number;
  trending?: boolean;
}

export function FrameStats({ impressions, clicks, ctr, users, trending }: FrameStatsProps) {
  const stats = [
    {
      label: 'Impressions',
      value: impressions.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      label: 'Clicks',
      value: clicks.toLocaleString(),
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      label: 'CTR',
      value: `${ctr.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      label: 'Users',
      value: users.toLocaleString(),
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            {trending && (
              <Badge variant="destructive" className="gap-1 text-xs">
                <Flame className="h-3 w-3" />
                Trending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <div>
                  <div className="text-sm font-semibold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}