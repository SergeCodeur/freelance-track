// src/app/api/auth/register/route.ts
import { getCurrencyFromCountry } from "@/lib/location"; // Import util
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/lib/schemas"; // Import combined schema
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the entire payload against the combined schema
    const validationResult = RegisterSchema.safeParse(body);

    if (!validationResult.success) {
      console.error(
        "Registration validation error:",
        validationResult.error.errors
      );
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, country, phone, freelancerType } =
      validationResult.data;

    // Double-check email uniqueness (although middleware might handle some cases)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet e-mail est déjà utilisé." },
        { status: 409 }
      ); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Determine currency from country code
    const currency = getCurrencyFromCountry(country);
    if (!currency) {
      // Handle cases where country might not have a currency mapped or is invalid
      console.warn(
        `No currency mapping found for country code: ${country}. Defaulting might be needed or reject.`
      );
      // Depending on requirements, you might return an error or use a default.
      // return NextResponse.json({ message: 'Invalid country code or no currency mapping.' }, { status: 400 });
    }

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        country,
        currency: currency || null, // Store derived currency or null if not found/required
        phone: phone || null, // Store phone or null
        freelancerType,
      },
      select: {
        // Only select non-sensitive fields to return
        id: true,
        name: true,
        email: true,
        country: true,
        currency: true,
        phone: true,
        freelancerType: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      // Catch Zod validation errors just in case
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Optional: Endpoint to check email existence during signup step 1
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email parameter is required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true }, // Only need to know if it exists
    });

    return NextResponse.json({ exists: !!existingUser });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
