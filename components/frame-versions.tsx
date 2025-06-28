'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFrameVersions } from '@/hooks/use-frame-versions';
import { GitBranch, Clock, Star, Copy, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { toast } from 'sonner';

interface FrameVersionsProps {
  frameId: string;
  onVersionSelect?: (version: any) => void;
}

export function FrameVersions({ frameId, onVersionSelect }: FrameVersionsProps) {
  const { versions, isLoading, createVersion, setCurrentVersion } = useFrameVersions(frameId);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleCreateVersion = async (baseVersionId?: string) => {
    const baseVersion = baseVersionId 
      ? versions.find(v => v.id === baseVersionId)
      : versions.find(v => v.is_current);

    if (!baseVersion) return;

    const newVersion = await createVersion({
      title: `${baseVersion.title} (Copy)`,
      description: baseVersion.description,
      image_url: baseVersion.image_url,
      button1_label: baseVersion.button1_label,
      button1_target: baseVersion.button1_target,
      json_full: baseVersion.json_full,
    });

    if (newVersion) {
      toast.success('New version created!', {
        description: 'You can now edit this version independently',
      });
    }
  };

  const handleSetCurrent = async (versionId: string) => {
    const success = await setCurrentVersion(versionId);
    if (success) {
      toast.success('Version activated!', {
        description: 'This version is now live',
      });
    }
  };

  const handlePreviewVersion = (version: any) => {
    setSelectedVersion(version.id);
    if (onVersionSelect) {
      onVersionSelect(version);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Frame Versions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-16 h-12 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Frame Versions ({versions.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={() => handleCreateVersion()}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Create Version
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-3 transition-all hover:shadow-md ${
                selectedVersion === version.id ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Version Preview */}
                <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                  <Image
                    src={version.image_url}
                    alt={`Version ${version.version_number}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Version Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      v{version.version_number}: {version.title}
                    </h4>
                    {version.is_current && (
                      <Badge variant="default" className="text-xs gap-1">
                        <Star className="h-3 w-3" />
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {version.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePreviewVersion(version)}
                    className="h-8 px-2"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  
                  {!version.is_current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetCurrent(version.id)}
                      className="h-8 px-2 text-xs"
                    >
                      Activate
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCreateVersion(version.id)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {versions.length === 0 && (
          <div className="text-center py-8">
            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No versions yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first version to start tracking changes
            </p>
            <Button onClick={() => handleCreateVersion()} className="gap-2">
              <Copy className="h-4 w-4" />
              Create First Version
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}