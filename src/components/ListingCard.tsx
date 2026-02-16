import Link from "next/link";
import type { Business } from "@/lib/types";

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const label = reviewCount === 0 ? "No reviews" : reviewCount === 1 ? "1 review" : `${reviewCount} reviews`;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600">
        {rating.toFixed(1)} ({label})
      </span>
    </div>
  );
}

export default function ListingCard({ business }: { business: Business }) {
  const href = `/${business.state_slug}/${business.city_slug}/${business.slug}`;

  return (
    <Link href={href} className="block">
      <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {business.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {business.address}, {business.city}, {business.state_abbr}{" "}
              {business.zip}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {business.is_emergency && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Emergency
              </span>
            )}
            {business.is_24hr && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                24/7
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <StarRating rating={business.rating} reviewCount={business.review_count} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600">
          {business.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {business.services.slice(0, 4).map((service) => (
            <span
              key={service}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {service}
            </span>
          ))}
          {business.services.length > 4 && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
              +{business.services.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          {business.phone && (
            <span className="text-gray-600">{business.phone}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
