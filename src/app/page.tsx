import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { US_STATES } from "@/lib/states";
import { getStatesWithCounts, getTotalBusinessCount } from "@/lib/data";

export default async function HomePage() {
  const [statesWithCounts, totalCount] = await Promise.all([
    getStatesWithCounts(),
    getTotalBusinessCount(),
  ]);

  const countMap = new Map(statesWithCounts.map((s) => [s.slug, s.business_count]));

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Find Trusted <span className="text-blue-600">HVAC Contractors</span>{" "}
            Near You
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Compare top-rated heating, cooling, and air conditioning
            professionals across the United States.{" "}
            {totalCount > 0 && (
              <span className="font-medium">
                {totalCount.toLocaleString()} contractors and counting.
              </span>
            )}
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Browse by State</h2>
        <p className="mt-2 text-gray-600">
          Select your state to find HVAC contractors in your area.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {US_STATES.map((state) => {
            const count = countMap.get(state.slug) || 0;
            return (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="text-sm font-medium text-gray-900">
                  {state.name}
                </span>
                {count > 0 && (
                  <span className="text-xs text-gray-400">{count}</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900">
            Why Use HVACLocate?
          </h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              Finding a reliable HVAC contractor shouldn&apos;t be a guessing
              game. HVACLocate makes it easy to compare heating and cooling
              professionals in your area based on real customer reviews,
              services offered, and availability.
            </p>
            <p>
              Whether you need emergency AC repair, a new furnace installation,
              or routine duct cleaning, our directory helps you find the right
              contractor for the job. We cover all 50 states with verified
              business information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
