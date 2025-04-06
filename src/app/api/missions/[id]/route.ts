import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MissionSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// PUT /api/missions/[id] - Update a specific mission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: missionId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  if (!missionId) {
    return NextResponse.json(
      { message: "Mission ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const validationResult = MissionSchema.safeParse({
      ...body,
      date: body.date ? new Date(body.date) : undefined,
      amount: body.amount !== undefined ? Number(body.amount) : undefined,
    });

    if (!validationResult.success) {
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

    const existingMission = await prisma.mission.findFirst({
      where: { id: missionId, userId: userId },
    });

    if (!existingMission) {
      return NextResponse.json(
        { message: "Mission not found or access denied" },
        { status: 404 }
      );
    }

    if (clientId !== existingMission.clientId) {
      const client = await prisma.client.findFirst({
        where: { id: clientId, userId: userId },
      });
      if (!client) {
        return NextResponse.json(
          { message: "New client not found or does not belong to user" },
          { status: 404 }
        );
      }
    }

    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: {
        title,
        clientId,
        amount,
        date,
        status,
        comment: comment || null,
      },
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      message: "Mission updated successfully",
      mission: updatedMission,
    });
  } catch (error) {
    console.error(`Error updating mission ${missionId}:`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes("timed out")) {
      return NextResponse.json(
        { message: "Database connection timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/missions/[id] - Delete a specific mission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: missionId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  if (!missionId) {
    return NextResponse.json(
      { message: "Mission ID is required" },
      { status: 400 }
    );
  }

  try {
    const existingMission = await prisma.mission.findFirst({
      where: { id: missionId, userId: userId },
      select: { id: true },
    });

    if (!existingMission) {
      return NextResponse.json(
        { message: "Mission not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.mission.delete({
      where: { id: missionId },
    });

    return NextResponse.json(
      { message: "Mission deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting mission ${missionId}:`, error);
    if (error instanceof Error && error.message.includes("timed out")) {
      return NextResponse.json(
        { message: "Database connection timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
