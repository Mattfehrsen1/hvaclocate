import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getStateBySlug } from "@/lib/states";
import { getCitiesForState } from "@/lib/data";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};

  return {
    title: `HVAC Contractors in ${state.name} — Find Heating & Cooling Pros`,
    description: `Browse top-rated HVAC contractors in ${state.name}. Compare heating, cooling, and air conditioning professionals by city with reviews and ratings.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  const cities = await getCitiesForState(stateSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: state.name }]} />

      <h1 className="text-3xl font-bold text-gray-900">
        HVAC Contractors in {state.name}
      </h1>
      <p className="mt-2 text-gray-600">
        Find trusted heating, cooling, and air conditioning professionals in{" "}
        {state.name}. Select a city below to see local HVAC contractors.
      </p>

      {cities.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${stateSlug}/${city.slug}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="text-sm font-medium text-gray-900">
                {city.name}
              </span>
              <span className="text-xs text-gray-400">
                {city.business_count}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            We&apos;re still adding HVAC contractors in {state.name}. Check back
            soon!
          </p>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 border-t border-gray-100 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          About HVAC Services in {state.name}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {state.name} homeowners rely on professional HVAC contractors for
          heating and cooling maintenance, repairs, and installations. Whether
          you need furnace repair during winter, AC installation for summer, or
          routine duct cleaning, HVACLocate helps you find qualified
          professionals in your {state.name} city.
        </p>
      </section>
    </div>
  );
}
