/*
  # Initial Schema for FrameStore

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `wallet_address` (text, unique)
      - `created_at` (timestamp)
    - `frames`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `button1_label` (text)
      - `button1_target` (text)
      - `json_full` (jsonb)
      - `likes` (integer, default 0)
      - `created_at` (timestamp)
    - `likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `frame_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create frames table
CREATE TABLE IF NOT EXISTS frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  button1_label text NOT NULL,
  button1_target text NOT NULL,
  json_full jsonb NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  frame_id uuid REFERENCES frames(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, frame_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Create policies for frames table
CREATE POLICY "Anyone can read frames"
  ON frames
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own frames"
  ON frames
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own frames"
  ON frames
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own frames"
  ON frames
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create policies for likes table
CREATE POLICY "Anyone can read likes"
  ON likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own likes"
  ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create functions for like counting
CREATE OR REPLACE FUNCTION increment_likes(frame_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE frames SET likes = likes + 1 WHERE id = frame_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes(frame_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE frames SET likes = GREATEST(likes - 1, 0) WHERE id = frame_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_frames_user_id ON frames(user_id);
CREATE INDEX IF NOT EXISTS idx_frames_created_at ON frames(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_frames_likes ON frames(likes DESC);
CREATE INDEX IF NOT EXISTS idx_likes_frame_id ON likes(frame_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);