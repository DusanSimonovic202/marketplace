
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import DeleteAdvertisementButton from "./DeleteAdvertisementButton";

type Props = {
  params: Promise<{ id: string }>;
};

async function AdvertisementContent({ params }: Props) {
  const { id } = await params;

  const advertisement = await prisma.advertisement.findFirst({
    where: {
      id,
      status: "ACTIVE",
    },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
  });

  if (!advertisement) {
    notFound();
  }
  const session = await auth();

const isOwner = session?.user?.email
  ? (
      await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    )?.id === advertisement.user.id
  : false;

  const price = advertisement.price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: advertisement.currency,
        maximumFractionDigits: 2,
      }).format(Number(advertisement.price))
    : "Price on request";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-black">
            market<span className="text-emerald-600">place.</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-gray-600 hover:text-emerald-600"
          >
            Back to marketplace
          </Link>
        </div>
      </header>

      {/* Advertisement */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Main content */}
          <div className="lg:col-span-2">

            {/* Advertisement images */}
<div className="overflow-hidden rounded-2xl bg-white">
  {advertisement.images && advertisement.images.length > 0 ? (
    <div className="grid gap-2">
      {advertisement.images.map((image, index) => (
        <div
          key={index}
          className="flex h-80 items-center justify-center bg-slate-100"
        >
          <img
            src={image}
            alt={`${advertisement.title} - image ${index + 1}`}
            className="h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex h-80 items-center justify-center bg-slate-200">
      <span className="text-7xl font-black text-gray-400">
        {advertisement.category.name.charAt(0)}
      </span>
    </div>
  )}
</div>

            {/* Advertisement information */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-7">

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {advertisement.category.name}
                </span>

                <span className="text-sm text-gray-500">
                  {advertisement.condition === "NEW"
                    ? "New"
                    : advertisement.condition === "USED"
                    ? "Used"
                    : "Condition not specified"}
                </span>
              </div>

              <h1 className="text-3xl font-bold">
                {advertisement.title}
              </h1>

              <p className="mt-5 text-3xl font-bold text-emerald-700">
                {price}
              </p>

              {/* Description */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h2 className="text-xl font-bold">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                  {advertisement.description}
                </p>
              </div>

              {/* Location */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h2 className="text-xl font-bold">
                  Location
                </h2>

                <p className="mt-3 text-gray-600">
                  {[advertisement.city, advertisement.country]
                    .filter(Boolean)
                    .join(", ") || "Location not specified"}
                </p>
              </div>

            </div>
          </div>

          {/* Seller information */}
          <aside>
            <div className="rounded-2xl border border-gray-100 bg-white p-7">

              <h2 className="text-lg font-bold">
                Seller information
              </h2>

              <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                {(advertisement.user.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <p className="mt-3 font-semibold">
                {advertisement.user.name || "Marketplace user"}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Member since{" "}
                {advertisement.user.createdAt.toLocaleDateString("en-US")}
              </p>
              {isOwner && (
  <div className="mt-6 border-t border-gray-100 pt-5">
    <DeleteAdvertisementButton id={advertisement.id} />
  </div>
)}

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

export default function AdvertisementPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">
            Loading advertisement...
          </p>
        </main>
      }
    >
      <AdvertisementContent params={params} />
    </Suspense>
  );
}
