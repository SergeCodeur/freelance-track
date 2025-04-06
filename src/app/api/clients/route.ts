import { auth } from "@/lib/auth"; // Server-side auth
import prisma from "@/lib/prisma";
import { ClientSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// GET /api/clients - Fetch all clients for the logged-in user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const clients = await prisma.client.findMany({
      where: { userId: userId },
      include: {
        // Include related missions count or full missions if needed for display
        missions: {
          orderBy: { createdAt: "desc" }, // Order missions within each client
          // select: { id: true, title: true } // Only select necessary mission fields if needed
        },
        // _count: { // Alternatively, just get the count
        //   select: { missions: true },
        // },
      },
      orderBy: {
        createdAt: "desc", // Order clients by creation date
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validate input data
    const validationResult = ClientSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone } = validationResult.data;

    const newClient = await prisma.client.create({
      data: {
        name,
        email: email || null, // Store null if empty
        phone: phone || null, // Store null if empty
        userId, // Link to the logged-in user
      },
      // Include missions count or empty array in response if needed by frontend store immediately
      // include: { _count: { select: { missions: true } } }
      // Or return the full client object
    });

    // Return the newly created client, potentially with an empty missions array for store consistency
    const clientForResponse = { ...newClient, missions: [] };

    return NextResponse.json(
      { message: "Client created successfully", client: clientForResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating client:", error);
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
