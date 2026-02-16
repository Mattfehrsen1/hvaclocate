export interface Business {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  city_slug: string;
  state: string;
  state_slug: string;
  state_abbr: string;
  zip: string;
  phone: string;
  website: string | null;
  rating: number;
  review_count: number;
  categories: string[];
  services: string[];
  description: string;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_emergency: boolean;
  is_24hr: boolean;
  created_at: string;
  updated_at: string;
}

export interface StateInfo {
  name: string;
  slug: string;
  abbr: string;
  business_count: number;
}

export interface CityInfo {
  name: string;
  slug: string;
  state: string;
  state_slug: string;
  state_abbr: string;
  business_count: number;
}
