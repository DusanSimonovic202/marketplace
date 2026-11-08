import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      return NextResponse.json(
        { message: "Advertisement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      advertisement,
    });
  } catch (error) {
    console.error("Fetching advertisement failed:", error);

    return NextResponse.json(
      { message: "Failed to fetch advertisement." },
      { status: 500 }
    );
  }
}

// DELETE advertisement
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const result = await prisma.advertisement.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Advertisement not found or you are not the owner." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Advertisement deleted successfully.",
    });
  } catch (error) {
    console.error("Deleting advertisement failed:", error);

    return NextResponse.json(
      { message: "Failed to delete advertisement." },
      { status: 500 }
    );
  }
}