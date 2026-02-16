import { getSupabase } from "./supabase";
import type { Business, StateInfo, CityInfo } from "./types";

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL;

// --- Mock data for development ---
const MOCK_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Arctic Air Heating & Cooling",
    slug: "arctic-air-heating-cooling",
    address: "1234 Main St",
    city: "Los Angeles",
    city_slug: "los-angeles",
    state: "California",
    state_slug: "california",
    state_abbr: "CA",
    zip: "90001",
    phone: "(310) 555-0101",
    website: "https://arcticairhvac.com",
    rating: 4.8,
    review_count: 247,
    categories: ["HVAC", "Air Conditioning", "Heating"],
    services: ["AC Repair", "Furnace Installation", "Duct Cleaning", "Emergency Service"],
    description: "Family-owned HVAC company serving Los Angeles since 2005. Specializing in residential and commercial heating and cooling systems.",
    image_url: null,
    latitude: 34.0522,
    longitude: -118.2437,
    is_emergency: true,
    is_24hr: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "2",
    name: "SoCal Comfort Systems",
    slug: "socal-comfort-systems",
    address: "5678 Oak Ave",
    city: "Los Angeles",
    city_slug: "los-angeles",
    state: "California",
    state_slug: "california",
    state_abbr: "CA",
    zip: "90015",
    phone: "(323) 555-0202",
    website: "https://socalcomfort.com",
    rating: 4.6,
    review_count: 189,
    categories: ["HVAC", "Air Conditioning"],
    services: ["AC Repair", "AC Installation", "Maintenance Plans"],
    description: "Top-rated HVAC contractor in Los Angeles providing reliable air conditioning and heating services for homes and businesses.",
    image_url: null,
    latitude: 34.0407,
    longitude: -118.2668,
    is_emergency: false,
    is_24hr: false,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "3",
    name: "Lone Star HVAC Pros",
    slug: "lone-star-hvac-pros",
    address: "789 Commerce St",
    city: "Houston",
    city_slug: "houston",
    state: "Texas",
    state_slug: "texas",
    state_abbr: "TX",
    zip: "77001",
    phone: "(713) 555-0303",
    website: "https://lonestarhvac.com",
    rating: 4.9,
    review_count: 312,
    categories: ["HVAC", "Heating", "Air Conditioning"],
    services: ["AC Repair", "Furnace Repair", "Heat Pump Installation", "24/7 Emergency"],
    description: "Houston's most trusted HVAC company. Licensed and insured technicians available 24/7 for all your heating and cooling needs.",
    image_url: null,
    latitude: 29.7604,
    longitude: -95.3698,
    is_emergency: true,
    is_24hr: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "4",
    name: "Bayou Breeze Cooling",
    slug: "bayou-breeze-cooling",
    address: "456 Westheimer Rd",
    city: "Houston",
    city_slug: "houston",
    state: "Texas",
    state_slug: "texas",
    state_abbr: "TX",
    zip: "77006",
    phone: "(832) 555-0404",
    website: null,
    rating: 4.5,
    review_count: 98,
    categories: ["Air Conditioning", "HVAC"],
    services: ["AC Repair", "AC Installation", "Duct Cleaning"],
    description: "Affordable air conditioning services in the greater Houston area. Free estimates on all installations.",
    image_url: null,
    latitude: 29.7430,
    longitude: -95.3934,
    is_emergency: false,
    is_24hr: false,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "5",
    name: "Windy City Climate Control",
    slug: "windy-city-climate-control",
    address: "321 Michigan Ave",
    city: "Chicago",
    city_slug: "chicago",
    state: "Illinois",
    state_slug: "illinois",
    state_abbr: "IL",
    zip: "60601",
    phone: "(312) 555-0505",
    website: "https://windycityclimate.com",
    rating: 4.7,
    review_count: 201,
    categories: ["HVAC", "Heating", "Air Conditioning"],
    services: ["Furnace Repair", "Boiler Service", "AC Installation", "Emergency Heating"],
    description: "Chicago's go-to HVAC contractor for harsh winters and hot summers. Specializing in furnace repair and boiler services.",
    image_url: null,
    latitude: 41.8781,
    longitude: -87.6298,
    is_emergency: true,
    is_24hr: false,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

// --- Data access functions ---

export async function getStatesWithCounts(): Promise<StateInfo[]> {
  if (USE_MOCK) {
    const counts = new Map<string, number>();
    for (const b of MOCK_BUSINESSES) {
      counts.set(b.state_slug, (counts.get(b.state_slug) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([slug, count]) => {
      const biz = MOCK_BUSINESSES.find((b) => b.state_slug === slug)!;
      return {
        name: biz.state,
        slug: biz.state_slug,
        abbr: biz.state_abbr,
        business_count: count,
      };
    });
  }

  const { data, error } = await getSupabase()
    .from("businesses")
    .select("state, state_slug, state_abbr");

  if (error) throw error;

  const counts = new Map<string, { name: string; slug: string; abbr: string; count: number }>();
  for (const row of data || []) {
    const existing = counts.get(row.state_slug);
    if (existing) {
      existing.count++;
    } else {
      counts.set(row.state_slug, {
        name: row.state,
        slug: row.state_slug,
        abbr: row.state_abbr,
        count: 1,
      });
    }
  }

  return Array.from(counts.values())
    .map((s) => ({ ...s, business_count: s.count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCitiesForState(stateSlug: string): Promise<CityInfo[]> {
  if (USE_MOCK) {
    const counts = new Map<string, number>();
    const filtered = MOCK_BUSINESSES.filter((b) => b.state_slug === stateSlug);
    for (const b of filtered) {
      counts.set(b.city_slug, (counts.get(b.city_slug) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([slug, count]) => {
      const biz = filtered.find((b) => b.city_slug === slug)!;
      return {
        name: biz.city,
        slug: biz.city_slug,
        state: biz.state,
        state_slug: biz.state_slug,
        state_abbr: biz.state_abbr,
        business_count: count,
      };
    });
  }

  const { data, error } = await getSupabase()
    .from("businesses")
    .select("city, city_slug, state, state_slug, state_abbr")
    .eq("state_slug", stateSlug);

  if (error) throw error;

  const counts = new Map<string, CityInfo & { count: number }>();
  for (const row of data || []) {
    const existing = counts.get(row.city_slug);
    if (existing) {
      existing.count++;
    } else {
      counts.set(row.city_slug, {
        name: row.city,
        slug: row.city_slug,
        state: row.state,
        state_slug: row.state_slug,
        state_abbr: row.state_abbr,
        business_count: 0,
        count: 1,
      });
    }
  }

  return Array.from(counts.values())
    .map((c) => ({ ...c, business_count: c.count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBusinessesForCity(
  stateSlug: string,
  citySlug: string
): Promise<Business[]> {
  if (USE_MOCK) {
    return MOCK_BUSINESSES.filter(
      (b) => b.state_slug === stateSlug && b.city_slug === citySlug
    );
  }

  const { data, error } = await getSupabase()
    .from("businesses")
    .select("*")
    .eq("state_slug", stateSlug)
    .eq("city_slug", citySlug)
    .order("rating", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBusinessBySlug(
  stateSlug: string,
  citySlug: string,
  businessSlug: string
): Promise<Business | null> {
  if (USE_MOCK) {
    return (
      MOCK_BUSINESSES.find(
        (b) =>
          b.state_slug === stateSlug &&
          b.city_slug === citySlug &&
          b.slug === businessSlug
      ) || null
    );
  }

  const { data, error } = await getSupabase()
    .from("businesses")
    .select("*")
    .eq("state_slug", stateSlug)
    .eq("city_slug", citySlug)
    .eq("slug", businessSlug)
    .single();

  if (error) return null;
  return data;
}

export async function searchBusinesses(query: string): Promise<Business[]> {
  if (USE_MOCK) {
    const q = query.toLowerCase();
    return MOCK_BUSINESSES.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        b.services.some((s) => s.toLowerCase().includes(q))
    );
  }

  const { data, error } = await getSupabase()
    .from("businesses")
    .select("*")
    .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)
    .order("rating", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

export async function getTotalBusinessCount(): Promise<number> {
  if (USE_MOCK) return MOCK_BUSINESSES.length;

  const { count, error } = await getSupabase()
    .from("businesses")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count || 0;
}
