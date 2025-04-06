import { auth } from "@/lib/auth"; // Import server-side auth
import prisma from "@/lib/prisma";
import { MissionSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// GET /api/missions - Fetch all missions for the logged-in user
export async function GET() {
  const session = await auth(); // Get session server-side
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const missions = await prisma.mission.findMany({
      where: { userId: userId },
      include: {
        client: {
          // Include client details
          select: { id: true, name: true }, // Select only needed client fields
        },
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
    });
    return NextResponse.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/missions - Create a new mission
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session?.user.currency) {
    // Ensure user and currency exist
    return NextResponse.json(
      { message: "Unauthorized or user currency not set" },
      { status: 401 }
    );
  }
  const userId = session.user.id;
  const userCurrency = session.user.currency; // Get currency from session

  try {
    const body = await request.json();

    // Validate input data
    const validationResult = MissionSchema.safeParse({
      ...body,
      date: body.date ? new Date(body.date) : undefined, // Ensure date is parsed
    });

    if (!validationResult.success) {
      console.error(
        "Mission validation error (POST):",
        validationResult.error.flatten()
      );
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, clientId, amount, date, status, comment } =
      validationResult.data;

    // Verify the client belongs to the user
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: userId },
    });
    if (!client) {
      return NextResponse.json(
        { message: "Client not found or does not belong to user" },
        { status: 404 }
      );
    }

    const newMission = await prisma.mission.create({
      data: {
        title,
        amount: Number(amount), // Ensure amount is number
        currency: userCurrency, // Set currency from logged-in user
        date,
        status, // Already validated enum by Zod
        comment: comment || null,
        clientId,
        userId, // Link to the logged-in user
      },
      include: {
        // Include client details in the response
        client: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Mission created successfully", mission: newMission },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating mission:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
