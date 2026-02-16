import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import { searchBusinesses } from "@/lib/data";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search HVAC Contractors",
    description: q
      ? `Find HVAC contractors matching "${q}". Compare ratings, services, and prices.`
      : "Search for HVAC contractors by city, state, or company name.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const results = q ? await searchBusinesses(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {q ? `Results for "${q}"` : "Search HVAC Contractors"}
      </h1>

      <div className="mt-6">
        <SearchBar />
      </div>

      {q && (
        <p className="mt-4 text-sm text-gray-500">
          {results.length} result{results.length === 1 ? "" : "s"} found
        </p>
      )}

      {results.length > 0 ? (
        <div className="mt-6 space-y-4">
          {results.map((business) => (
            <ListingCard key={business.id} business={business} />
          ))}
        </div>
      ) : q ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            No HVAC contractors found matching &ldquo;{q}&rdquo;. Try searching
            for a different city or state.
          </p>
        </div>
      ) : null}
    </div>
  );
}
