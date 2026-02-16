import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ListingCard from "@/components/ListingCard";
import { getStateBySlug } from "@/lib/states";
import { getBusinessesForCity } from "@/lib/data";

interface Props {
  params: Promise<{ state: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};

  const cityName = citySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `HVAC Contractors in ${cityName}, ${state.abbr} — Top Rated Pros`,
    description: `Find the best HVAC contractors in ${cityName}, ${state.name}. Compare ratings, services, and prices for heating and cooling professionals near you.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  const businesses = await getBusinessesForCity(stateSlug, citySlug);

  const cityName = businesses[0]?.city ||
    citySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: state.name, href: `/${stateSlug}` },
          { label: cityName },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900">
        HVAC Contractors in {cityName}, {state.abbr}
      </h1>
      <p className="mt-2 text-gray-600">
        {businesses.length > 0
          ? `Showing ${businesses.length} HVAC contractor${businesses.length === 1 ? "" : "s"} in ${cityName}, ${state.name}. Compare ratings, services, and availability.`
          : `We're still adding HVAC contractors in ${cityName}. Check back soon!`}
      </p>

      {businesses.length > 0 ? (
        <div className="mt-8 space-y-4">
          {businesses.map((business) => (
            <ListingCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            No HVAC contractors found in {cityName} yet. Check nearby cities or
            search for a different location.
          </p>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 border-t border-gray-100 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          HVAC Services in {cityName}, {state.abbr}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Looking for reliable HVAC service in {cityName}, {state.name}? Our
          directory lists verified heating and cooling contractors with real
          customer reviews. Services include AC repair, furnace installation,
          duct cleaning, heat pump service, and emergency HVAC repair. Compare
          contractors to find the best fit for your needs and budget.
        </p>
      </section>
    </div>
  );
}
