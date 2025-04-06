import { auth } from "@/lib/auth"; // Server-side auth
import { getCurrencyFromCountry } from "@/lib/location"; // Import util
import prisma from "@/lib/prisma";
import { ProfileSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// PUT /api/user/profile - Update user profile information
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validate input data using ProfileSchema
    const validationResult = ProfileSchema.safeParse(body);

    if (!validationResult.success) {
      console.error(
        "Profile update validation error:",
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

    const { name, phone, country, freelancerType } = validationResult.data;

    // Recalculate currency based on the updated country
    const currency = getCurrencyFromCountry(country);
    // Consider what to do if currency is null (e.g., keep old one, set null, return error)
    // Here, we'll update it to the derived one or null if not found.
    // if (!currency && country) {
    //    console.warn(`No currency mapping for country ${country} during profile update.`);
    // }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name ?? undefined, // Use current value if not provided
        phone: phone || null, // Update phone, store null if empty
        country: country ?? undefined,
        currency: currency || null, // Update currency based on country
        freelancerType: freelancerType ?? undefined,
        // email cannot be updated here
      },
      select: {
        // Return updated non-sensitive info
        id: true,
        name: true,
        email: true,
        country: true,
        currency: true,
        phone: true,
        freelancerType: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
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
