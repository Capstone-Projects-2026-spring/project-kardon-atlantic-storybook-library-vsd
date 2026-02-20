# Supabase Setup Guide

## Step 1: Get Your Supabase Credentials
1. Go to https://supabase.com and sign in
2. Create a new project or use an existing one
3. Go to Settings > API - copy your:
   - Project URL
   - Anon Key

## Step 2: Create the .env.local File
Create a `.env.local` file in your project root (same level as package.json):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create the Hotspots Table
In your Supabase dashboard, go to the SQL Editor and run this query:

```sql
CREATE TABLE hotspots (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_id VARCHAR(255) NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  radius FLOAT DEFAULT 12,
  label VARCHAR(255)
);

-- Create an index for faster queries
CREATE INDEX hotspots_image_id_idx ON hotspots(image_id);
```

## Step 4: Done!
The app will now automatically load and save hotspots to Supabase. You'll see a "Synced" indicator when changes are saved.
