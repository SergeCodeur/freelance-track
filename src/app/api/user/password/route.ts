import { auth } from "@/lib/auth"; // Server-side auth
import { comparePassword, hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { PasswordChangeSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// PUT /api/user/password - Change user password
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validate input data
    const validationResult = PasswordChangeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // 1. Fetch the current user from DB including the password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      // This case should ideally not happen for credential users
      console.error(`User ${userId} not found or has no password set.`);
      return NextResponse.json(
        { message: "User not found or invalid state" },
        { status: 404 }
      );
    }

    // 2. Verify the current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Le mot de passe actuel est incorrect." },
        { status: 403 }
      ); // 403 Forbidden/Incorrect Creds
    }

    // 3. Hash the new password
    const newHashedPassword = await hashPassword(newPassword);

    // 4. Update the password in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: newHashedPassword,
      },
    });

    // Note: You might want to invalidate existing sessions here if using database sessions.
    // For JWT sessions, the change takes effect on the next token refresh/login.

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
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
