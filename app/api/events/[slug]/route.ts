import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise that must be awaited
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { message: "Event slug is required." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the event by its unique slug
    const event = await Event.findOne({ slug });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully.", event },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching event by slug:`, error);
    return NextResponse.json(
      {
        message: "Failed to fetch event.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
