-- Supabase schema for HVACLocate directory
-- Run this in your Supabase SQL Editor to create the database

CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  state TEXT NOT NULL,
  state_slug TEXT NOT NULL,
  state_abbr CHAR(2) NOT NULL,
  zip TEXT,
  phone TEXT,
  website TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  categories TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  image_url TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  is_emergency BOOLEAN DEFAULT FALSE,
  is_24hr BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_businesses_state_slug ON businesses(state_slug);
CREATE INDEX idx_businesses_city_slug ON businesses(state_slug, city_slug);
CREATE INDEX idx_businesses_slug ON businesses(state_slug, city_slug, slug);
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);

-- Unique constraint to prevent duplicates
CREATE UNIQUE INDEX idx_businesses_unique ON businesses(state_slug, city_slug, slug);

-- Full text search index
ALTER TABLE businesses ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(city, '') || ' ' || coalesce(state, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX idx_businesses_fts ON businesses USING GIN(fts);

-- Enable Row Level Security (read-only public access)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON businesses
  FOR SELECT USING (true);
