/*
  # Add Production Features to FrameStore

  1. New Tables
    - `frame_versions` - Frame versioning system
    - `notifications` - User notifications
    - `scheduled_frames` - Frame scheduling
    - `workspaces` - Team collaboration
    - `workspace_members` - Workspace membership
    - `templates` - Community templates
    - `analytics_events` - Detailed analytics
    - `user_achievements` - Gamification badges
    - `frame_translations` - Multi-language support

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies
    - Add indexes for performance

  3. Functions
    - Notification triggers
    - Analytics aggregation
    - Achievement calculation
*/

-- Frame Versions Table
CREATE TABLE IF NOT EXISTS frame_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  frame_id uuid REFERENCES frames(id) ON DELETE CASCADE NOT NULL,
  parent_version_id uuid REFERENCES frame_versions(id) ON DELETE SET NULL,
  version_number integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  button1_label text NOT NULL,
  button1_target text NOT NULL,
  json_full jsonb NOT NULL,
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(frame_id, version_number)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  frame_id uuid REFERENCES frames(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('milestone', 'collaboration', 'system', 'achievement')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Scheduled Frames Table
CREATE TABLE IF NOT EXISTS scheduled_frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  frame_id uuid REFERENCES frames(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  publish_at timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'cancelled')),
  platform text DEFAULT 'warpcast' CHECK (platform IN ('warpcast', 'farcaster')),
  auto_post boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  slug text UNIQUE NOT NULL,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Workspace Members Table
CREATE TABLE IF NOT EXISTS workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  invited_by uuid REFERENCES users(id) ON DELETE SET NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  preview_image text NOT NULL,
  template_data jsonb NOT NULL,
  is_public boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  price_cents integer DEFAULT 0,
  downloads integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  frame_id uuid REFERENCES frames(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('view', 'click', 'share', 'like', 'comment')),
  user_agent text,
  ip_address inet,
  country text,
  coordinates point,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_data jsonb DEFAULT '{}',
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Frame Translations Table
CREATE TABLE IF NOT EXISTS frame_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  frame_id uuid REFERENCES frames(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  button_labels jsonb NOT NULL,
  auto_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(frame_id, language_code)
);

-- Enable RLS on all new tables
ALTER TABLE frame_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE frame_translations ENABLE ROW LEVEL SECURITY;

-- Frame Versions Policies
CREATE POLICY "Users can read frame versions"
  ON frame_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM frames f 
      WHERE f.id = frame_versions.frame_id 
      AND (f.user_id = auth.uid()::text OR true)
    )
  );

CREATE POLICY "Users can create frame versions"
  ON frame_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM frames f 
      WHERE f.id = frame_versions.frame_id 
      AND f.user_id = auth.uid()::text
    )
  );

-- Notifications Policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Scheduled Frames Policies
CREATE POLICY "Users can manage own scheduled frames"
  ON scheduled_frames FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Workspaces Policies
CREATE POLICY "Users can read accessible workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM workspace_members wm 
      WHERE wm.workspace_id = workspaces.id 
      AND wm.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = owner_id);

CREATE POLICY "Owners can update workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = owner_id);

-- Workspace Members Policies
CREATE POLICY "Users can read workspace members"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces w 
      WHERE w.id = workspace_members.workspace_id 
      AND (w.owner_id = auth.uid()::text OR workspace_members.user_id = auth.uid()::text)
    )
  );

-- Templates Policies
CREATE POLICY "Anyone can read public templates"
  ON templates FOR SELECT
  TO authenticated
  USING (is_public = true OR creator_id = auth.uid()::text);

CREATE POLICY "Users can create templates"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = creator_id);

CREATE POLICY "Creators can update own templates"
  ON templates FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = creator_id);

-- Analytics Events Policies
CREATE POLICY "Anyone can create analytics events"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Frame owners can read analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM frames f 
      WHERE f.id = analytics_events.frame_id 
      AND f.user_id = auth.uid()::text
    )
  );

-- User Achievements Policies
CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can create achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Frame Translations Policies
CREATE POLICY "Anyone can read translations"
  ON frame_translations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Frame owners can manage translations"
  ON frame_translations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM frames f 
      WHERE f.id = frame_translations.frame_id 
      AND f.user_id = auth.uid()::text
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_frame_versions_frame_id ON frame_versions(frame_id);
CREATE INDEX IF NOT EXISTS idx_frame_versions_current ON frame_versions(frame_id, is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_scheduled_frames_publish_at ON scheduled_frames(publish_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON templates(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_analytics_events_frame_id ON analytics_events(frame_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_frame_translations_frame_id ON frame_translations(frame_id);

-- Functions for notifications and achievements
CREATE OR REPLACE FUNCTION check_frame_milestones()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for like milestones
  IF NEW.likes >= 10 AND OLD.likes < 10 THEN
    INSERT INTO notifications (user_id, frame_id, type, title, message)
    VALUES (NEW.user_id, NEW.id, 'milestone', '🎉 10 Likes Milestone!', 
            'Your frame "' || NEW.title || '" has reached 10 likes!');
  END IF;
  
  IF NEW.likes >= 100 AND OLD.likes < 100 THEN
    INSERT INTO notifications (user_id, frame_id, type, title, message)
    VALUES (NEW.user_id, NEW.id, 'milestone', '🚀 100 Likes Milestone!', 
            'Your frame "' || NEW.title || '" has reached 100 likes!');
            
    -- Award achievement
    INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
    VALUES (NEW.user_id, 'viral_frame', jsonb_build_object('frame_id', NEW.id, 'likes', NEW.likes))
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_user_achievements()
RETURNS TRIGGER AS $$
DECLARE
  frame_count integer;
BEGIN
  -- Check for frame creation milestones
  SELECT COUNT(*) INTO frame_count FROM frames WHERE user_id = NEW.user_id;
  
  IF frame_count = 1 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
    VALUES (NEW.user_id, 'first_frame', jsonb_build_object('frame_id', NEW.id))
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;
  
  IF frame_count = 10 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
    VALUES (NEW.user_id, 'frame_creator', jsonb_build_object('frame_count', frame_count))
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER frame_milestones_trigger
  AFTER UPDATE ON frames
  FOR EACH ROW
  WHEN (OLD.likes IS DISTINCT FROM NEW.likes)
  EXECUTE FUNCTION check_frame_milestones();

CREATE TRIGGER user_achievements_trigger
  AFTER INSERT ON frames
  FOR EACH ROW
  EXECUTE FUNCTION check_user_achievements();

-- Function to create frame version
CREATE OR REPLACE FUNCTION create_frame_version(
  p_frame_id uuid,
  p_title text,
  p_description text,
  p_image_url text,
  p_button1_label text,
  p_button1_target text,
  p_json_full jsonb
)
RETURNS uuid AS $$
DECLARE
  v_version_number integer;
  v_version_id uuid;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO v_version_number 
  FROM frame_versions 
  WHERE frame_id = p_frame_id;
  
  -- Create new version
  INSERT INTO frame_versions (
    frame_id, version_number, title, description, 
    image_url, button1_label, button1_target, json_full
  ) VALUES (
    p_frame_id, v_version_number, p_title, p_description,
    p_image_url, p_button1_label, p_button1_target, p_json_full
  ) RETURNING id INTO v_version_id;
  
  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql;

-- Function to set current version
CREATE OR REPLACE FUNCTION set_current_frame_version(p_version_id uuid)
RETURNS void AS $$
DECLARE
  v_frame_id uuid;
BEGIN
  -- Get frame_id from version
  SELECT frame_id INTO v_frame_id FROM frame_versions WHERE id = p_version_id;
  
  -- Unset all current versions for this frame
  UPDATE frame_versions SET is_current = false WHERE frame_id = v_frame_id;
  
  -- Set new current version
  UPDATE frame_versions SET is_current = true WHERE id = p_version_id;
  
  -- Update main frame table with current version data
  UPDATE frames f SET
    title = fv.title,
    description = fv.description,
    image_url = fv.image_url,
    button1_label = fv.button1_label,
    button1_target = fv.button1_target,
    json_full = fv.json_full
  FROM frame_versions fv
  WHERE f.id = v_frame_id AND fv.id = p_version_id;
END;
$$ LANGUAGE plpgsql;