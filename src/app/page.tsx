
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Advertisement = {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: string | null;
  currency: string;
  condition: "NEW" | "USED" | null;
  country: string | null;
  city: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    name: string | null;
  };
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
    const [currentUser, setCurrentUser] = useState<{
    name: string | null;
    email: string;
  } | null>(null);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
        });

        const data = await response.json();

        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Could not load user:", error);
      } finally {
        setAuthLoading(false);
      }
    }

    loadCurrentUser();
  }, []);
  const [listings, setListings] = useState<Advertisement[]>([]);

  const [category, setCategory] = useState("All categories");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load categories and advertisements from PostgreSQL
  useEffect(() => {
    async function loadMarketplace() {
      try {
        const [categoriesResponse, advertisementsResponse] =
          await Promise.all([
            fetch("/api/categories"),
            fetch("/api/advertisements"),
          ]);

        if (!categoriesResponse.ok || !advertisementsResponse.ok) {
          throw new Error("Failed to load marketplace data.");
        }

        const categoriesData = await categoriesResponse.json();
        const advertisementsData = await advertisementsResponse.json();

        setCategories(categoriesData.categories || []);
        setListings(advertisementsData.advertisements || []);
      } catch (error) {
        console.error("Marketplace loading error:", error);
        setError("Could not load advertisements. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadMarketplace();
  }, []);

  // Filter advertisements
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesCategory =
        category === "All categories" ||
        item.category.name === category;

      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const itemLocation =
        `${item.city || ""} ${item.country || ""}`.toLowerCase();

      const matchesLocation = itemLocation.includes(
        location.toLowerCase()
      );

      return matchesCategory && matchesSearch && matchesLocation;
    });
  }, [listings, category, search, location]);

  // Format prices
  function formatPrice(price: string | null, currency: string) {
    if (price === null) {
      return "Price on request";
    }

    const amount = Number(price);

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-black tracking-tight">
            market<span className="text-emerald-600">place.</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
           <a href="#categories" className="transition-colors hover:text-emerald-600">
  Categories
</a>
           <a
  href="#listings"
  onClick={(e) => {
    e.preventDefault();
    document.getElementById("listings")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
  className="hover:text-emerald-600 transition-colors"
>
  Explore
</a>
            <a href="/about" className="hover:text-emerald-600">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
  {authLoading ? (
    <span className="text-sm text-gray-400">Loading...</span>
  ) : currentUser ? (
    <>
      <span className="text-sm font-semibold text-gray-800">
        Welcome, {currentUser.name || currentUser.email}!
      </span>

      <button
        onClick={() => signOut({ redirectTo: "/" })}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
      >
        Sign out
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="hidden rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-100 sm:block"
      >
        Sign in
      </Link>

      <Link
        href="/register"
        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Create account
      </Link>
    </>
  )}
</div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#f5f8f5] px-5 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-block rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            A marketplace without borders
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Find what you need.
            <br />
            <span className="text-emerald-600">
              Sell what you don't.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-500 md:text-lg">
            Discover great deals, connect with people and buy or sell
            almost anything from anywhere in the world.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 rounded-2xl bg-white p-3 shadow-lg shadow-gray-200/60 md:grid-cols-[1fr_220px_auto]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for?"
              className="min-w-0 rounded-lg px-4 py-3 text-sm outline-none placeholder:text-gray-400"
              aria-label="Search advertisements"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="min-w-0 rounded-lg border-t border-gray-100 px-4 py-3 text-sm outline-none placeholder:text-gray-400 md:border-l md:border-t-0"
              aria-label="Filter by location"
            />

            <button
              onClick={() => {
                document
                  .getElementById("listings")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Search
            </button>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Buy and sell locally or internationally.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-600">
            EXPLORE
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Browse categories
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Find exactly what you're looking for.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCategory("All categories")}
            className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
              category === "All categories"
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:text-emerald-700"
            }`}
          >
            All categories
          </button>

          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => setCategory(item.name)}
              className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                category === item.name
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:text-emerald-700"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="bg-gray-50 px-5 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                THE MARKETPLACE
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Explore listings
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Discover what's available around the world.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {filteredListings.length} listings
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">
              Loading advertisements...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white py-16 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
              <h3 className="text-lg font-semibold">
                No listings found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setCategory("All categories");
                }}
                className="mt-5 font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredListings.map((item) => (
  <Link
    key={item.id}
    href={`/advertisement/${item.id}`}
    className="block"
  >
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                  {/* Advertisement image */}
<div className="h-48 w-full overflow-hidden bg-slate-100">
  {item.images && item.images.length > 0 ? (
    <img
      src={item.images[0]}
      alt={item.title}
      className="h-full w-full object-cover transition duration-300 hover:scale-105"
    />
  ) : (
    <div className="flex h-full items-center justify-center">
      <span className="text-5xl font-black text-gray-300">
        {item.category.name.charAt(0)}
      </span>
    </div>
  )}
</div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.category.name}
                      </span>

                      <span className="text-xs text-gray-400">
                        {item.condition
                          ? item.condition === "NEW"
                            ? "New"
                            : "Used"
                          : "Not specified"}
                      </span>
                    </div>

                    <h3 className="min-h-12 font-semibold leading-6 text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-xl font-bold text-gray-900">
                      {formatPrice(item.price, item.currency)}
                    </p>

              <div className="mt-4 border-t border-gray-100 pt-4 text-sm font-medium text-gray-600">
  {[item.city, item.country]
    .filter(Boolean)
    .join(", ") || "Location not specified"}
</div>

<div className="mt-2 text-sm text-gray-600">
  Seller: <span className="font-semibold text-gray-800">
    {item.user.name || "Marketplace user"}
  </span>
</div>
                  </div>
                </article>
                 </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section id="about" className="px-5 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gray-900 px-8 py-14 text-center text-white md:px-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Have something to sell?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-400">
            Create your account and get ready to reach buyers around the world.
          </p>

          <Link
            href="/post-ad"
            className="mt-8 inline-block rounded-lg bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Post an advertisement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
          <Link href="/" className="text-lg font-black text-gray-900">
            market<span className="text-emerald-600">place.</span>
          </Link>

          <p>Buy. Sell. Connect. Anywhere.</p>

          <p>© 2026 Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
