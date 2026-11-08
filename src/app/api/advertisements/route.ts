
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET: Fetch active advertisements
export async function GET() {
  try {
    const advertisements = await prisma.advertisement.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        category: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      advertisements,
    });
  } catch (error) {
    console.error("Fetching advertisements failed:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch advertisements." },
      { status: 500 }
    );
  }
}

// POST: Create a new advertisement
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must be logged in to post an ad." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      price,
      currency,
      condition,
      categoryId,
      country,
      city,
      images,
    } = body;

    // Validate required fields
    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { message: "Title, description and category are required." },
        { status: 400 }
      );
    }

    // Validate images
    if (
      images !== undefined &&
      (!Array.isArray(images) ||
        images.length > 8 ||
        !images.every(
          (image) =>
            typeof image === "string" &&
            image.startsWith("https://")
        ))
    ) {
      return NextResponse.json(
        { message: "Invalid advertisement images." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const slug = `${String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now()}`;

    const advertisement = await prisma.advertisement.create({
      data: {
        title: String(title).trim(),
        slug,
        description: String(description).trim(),
        price: price ? Number(price) : null,
        currency: currency || "USD",
        condition: condition || null,
        country: country || null,
        city: city || null,
        images: images || [],
        status: "ACTIVE",
        userId: user.id,
        categoryId,
      },
    });

    return NextResponse.json(
      {
        message: "Advertisement created successfully!",
        advertisement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Creating advertisement failed:", error);

    return NextResponse.json(
      { message: "Failed to create advertisement." },
      { status: 500 }
    );
  }
}
