import { auth } from "@/lib/auth"; // Authentification côté serveur
import prisma from "@/lib/prisma";
import { ClientSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// PUT /api/clients/[id] - Met à jour un client spécifique
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: clientId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validation des données d'entrée
    const validationResult = ClientSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Échec de la validation",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone } = validationResult.data;

    // Vérifie si le client existe et appartient à l'utilisateur
    const existingClient = await prisma.client.findFirst({
      where: { id: clientId, userId: userId },
      select: { id: true },
    });

    if (!existingClient) {
      return NextResponse.json(
        { message: "Client non trouvé ou accès refusé" },
        { status: 404 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name,
        email: email || null,
        phone: phone || null,
      },
    });

    return NextResponse.json({
      message: "Client mis à jour avec succès",
      client: updatedClient,
    });
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du client ${clientId}:`,
      error
    );
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Échec de la validation",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Supprime un client spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: clientId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Vérifie si le client existe et appartient à l'utilisateur
    const existingClient = await prisma.client.findFirst({
      where: { id: clientId, userId: userId },
      select: { id: true },
    });

    if (!existingClient) {
      return NextResponse.json(
        { message: "Client non trouvé ou accès refusé" },
        { status: 404 }
      );
    }

    await prisma.client.delete({
      where: { id: clientId },
    });

    return NextResponse.json(
      { message: "Client et missions associées supprimés avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du client ${clientId}:`,
      error
    );
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
