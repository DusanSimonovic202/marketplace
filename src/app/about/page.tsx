"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-black tracking-tight">
            market<span className="text-emerald-600">place.</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-gray-600 transition hover:text-emerald-600"
          >
            Back to marketplace
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#f5f8f5] px-5 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            About us
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            A marketplace without borders.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            A simple place to buy, sell and discover. We bring people together
            through products, opportunities and great deals.
          </p>

          <Link
            href="/"
            className="mt-9 inline-block rounded-lg bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Explore marketplace
          </Link>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            What we do
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need, in one place.
          </h2>

          <p className="mt-5 leading-8 text-gray-500">
            Marketplace makes it easier to connect buyers and sellers.
            Whether you're searching for something specific or looking
            to give your items a new home, our platform makes getting
            started simple.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
              🔎
            </div>
            <h3 className="mt-6 text-xl font-bold">Discover</h3>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              Browse different categories and discover products that match
              your needs.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
              🛍️
            </div>
            <h3 className="mt-6 text-xl font-bold">Buy</h3>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              Find interesting offers, compare listings and connect with
              sellers.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
              📦
            </div>
            <h3 className="mt-6 text-xl font-bold">Sell</h3>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              Create an advertisement, upload photos and introduce your
              products to potential buyers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Our mission
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Making buying and selling simple.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-500">
            We believe finding what you need or selling what you no longer
            use should be straightforward. Our goal is to create a convenient
            marketplace where people can connect and discover opportunities.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gray-900 px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-400">
            Explore available listings or create your own advertisement
            and become part of the marketplace.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-lg bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Explore listings
            </Link>

            <Link
              href="/post-ad"
              className="rounded-lg border border-gray-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Post an advertisement
            </Link>
          </div>
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