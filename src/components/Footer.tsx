import Link from "next/link";
import { US_STATES } from "@/lib/states";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <span className="text-lg font-bold text-gray-900">
              HVAC<span className="text-blue-600">Locate</span>
            </span>
            <p className="mt-2 text-sm text-gray-600">
              Find trusted HVAC contractors near you. Compare ratings, services,
              and get the heating and cooling help you need.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Browse by State
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-1">
              {US_STATES.slice(0, 15).map((state) => (
                <Link
                  key={state.slug}
                  href={`/${state.slug}`}
                  className="text-xs text-gray-500 hover:text-blue-600"
                >
                  {state.abbr}
                </Link>
              ))}
              <Link
                href="/"
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                All states &rarr;
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Services</h3>
            <ul className="mt-3 space-y-2">
              {[
                "AC Repair",
                "Furnace Repair",
                "HVAC Installation",
                "Duct Cleaning",
                "Emergency HVAC",
              ].map((service) => (
                <li key={service}>
                  <span className="text-xs text-gray-500">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} HVACLocate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
