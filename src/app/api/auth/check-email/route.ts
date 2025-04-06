// src/app/api/auth/check-email/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email non fourni." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    return NextResponse.json({ exists: !!user }); // ❗️renvoie false si user = null
  } catch (error) {
    console.error("Erreur check-email :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
