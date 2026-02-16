import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getStateBySlug } from "@/lib/states";
import { getBusinessBySlug } from "@/lib/data";

interface Props {
  params: Promise<{ state: string; city: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, slug } = await params;
  const business = await getBusinessBySlug(stateSlug, citySlug, slug);
  if (!business) return {};

  return {
    title: `${business.name} — HVAC Contractor in ${business.city}, ${business.state_abbr}`,
    description: `${business.name} in ${business.city}, ${business.state}. ${business.rating} star rating from ${business.review_count} reviews. Services: ${business.services.slice(0, 3).join(", ")}. Contact: ${business.phone}.`,
  };
}

export default async function ListingPage({ params }: Props) {
  const { state: stateSlug, city: citySlug, slug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  const business = await getBusinessBySlug(stateSlug, citySlug, slug);
  if (!business) notFound();

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state_abbr,
      postalCode: business.zip,
    },
    telephone: business.phone,
    url: business.website,
    aggregateRating: business.review_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: business.rating,
          reviewCount: business.review_count,
        }
      : undefined,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: state.name, href: `/${stateSlug}` },
          { label: business.city, href: `/${stateSlug}/${citySlug}` },
          { label: business.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {business.name}
              </h1>
              <p className="mt-1 text-gray-500">
                {business.address}, {business.city}, {business.state_abbr}{" "}
                {business.zip}
              </p>
            </div>
            <div className="flex gap-2">
              {business.is_emergency && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Emergency Service
                </span>
              )}
              {business.is_24hr && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  24/7 Available
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(business.rating)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {business.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({business.review_count} reviews)
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
            <p className="mt-2 text-gray-600">{business.description}</p>
          </div>

          {/* Services */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Services</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {business.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {business.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-700"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Contact Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>

            <div className="mt-4 space-y-4">
              {business.phone && (
                <div>
                  <p className="text-xs font-medium text-gray-500">Phone</p>
                  <a
                    href={`tel:${business.phone.replace(/\D/g, "")}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-700"
                  >
                    {business.phone}
                  </a>
                </div>
              )}

              {business.website && (
                <div>
                  <p className="text-xs font-medium text-gray-500">Website</p>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Visit Website &rarr;
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500">Address</p>
                <p className="text-sm text-gray-900">
                  {business.address}
                  <br />
                  {business.city}, {business.state_abbr} {business.zip}
                </p>
              </div>
            </div>

            {business.phone && (
              <a
                href={`tel:${business.phone.replace(/\D/g, "")}`}
                className="mt-6 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Call Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
