// src/lib/schemas.ts
import { z } from "zod";

// === Auth ===

export const LoginSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

// === Étape 1 ===

const signupStep1Base = z.object({
  name: z.string().min(2, {
    message: "Le nom complet doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  confirmPassword: z.string(),
});

export const SignupStep1Schema = signupStep1Base.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  }
);

// === Étape 2 ===

export const SignupStep2Schema = z.object({
  country: z.string().min(2, { message: "Le pays est requis." }),
  currency: z.string().min(3, { message: "La devise est requise." }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[0-9\s\-()]{7,}$/.test(val), {
      message: "Numéro de téléphone invalide.",
    }),
  freelancerType: z
    .string()
    .min(2, { message: "Le type de freelance est requis." }),
});

// === Schéma combiné pour l'inscription ===

export const SignupFullSchema = z.object({
  ...signupStep1Base.shape,
  ...SignupStep2Schema.shape,
});

export const RegisterSchema = SignupFullSchema.omit({
  confirmPassword: true,
}).refine((data) => data.password.length >= 8, {
  message: "Le mot de passe doit contenir au moins 8 caractères.",
  path: ["password"],
});

// === Mise à jour du profil ===

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Le nom complet doit contenir au moins 2 caractères.",
    })
    .optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[0-9\s\-()]{7,}$/.test(val), {
      message: "Numéro de téléphone invalide.",
    }),
  country: z.string().min(2, { message: "Le pays est requis." }).optional(),
  currency: z.string().min(3, { message: "La devise est requise." }).optional(),
  freelancerType: z
    .string()
    .min(2, { message: "Le type de freelance est requis." })
    .optional(),
});

// === Changement de mot de passe ===

export const PasswordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Le mot de passe actuel est requis." }),
    newPassword: z.string().min(8, {
      message: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
    }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les nouveaux mots de passe ne correspondent pas.",
    path: ["confirmNewPassword"],
  });

// === Clients ===

export const ClientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom du client est requis (minimum 2 caractères)." }),
  email: z
    .string()
    .email({ message: "Adresse e-mail invalide." })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[0-9\s\-()]{7,}$/.test(val), {
      message: "Numéro de téléphone invalide.",
    })
    .or(z.literal("")),
});

// === Missions ===

export const MissionSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Le titre est requis (minimum 3 caractères)." }),
  clientId: z.string().min(1, { message: "Le client est requis." }),
  amount: z.coerce
    .number({ invalid_type_error: "Le montant doit être un nombre." })
    .positive({ message: "Le montant doit être positif." }),
  date: z.date({
    required_error: "La date est requise.",
    invalid_type_error: "Format de date invalide.",
  }),
  status: z.enum(["pending", "paid", "partial", "cancelled"], {
    required_error: "Le statut est requis.",
  }),
  comment: z.string().optional(),
});

export const MissionStatusEnum = z.enum([
  "pending",
  "paid",
  "partial",
  "cancelled",
]);
export type MissionStatus = z.infer<typeof MissionStatusEnum>;

export const missionStatuses: { value: MissionStatus; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payé" },
  { value: "partial", label: "Partiel" },
  { value: "cancelled", label: "Annulé" },
];
