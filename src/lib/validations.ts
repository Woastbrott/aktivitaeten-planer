import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name muss mind. 2 Zeichen haben").max(60),
  email: z.email("Ungültige E-Mail-Adresse").trim().toLowerCase(),
  password: z.string().min(8, "Passwort muss mind. 8 Zeichen haben").max(72),
  inviteToken: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.email("Ungültige E-Mail-Adresse").trim().toLowerCase(),
  password: z.string().min(1, "Passwort erforderlich"),
})

export const activitySchema = z.object({
  title: z.string().trim().min(2, "Titel ist zu kurz").max(100),
  description: z.string().trim().max(2000).optional().default(""),
  category: z.enum([
    "WANDERN",
    "BADEN",
    "GRILLEN",
    "FESTIVAL",
    "SPORT",
    "KULTUR",
    "SONSTIGES",
  ]),
  location: z.string().trim().max(200).optional().default(""),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  date: z.string().optional().nullable(),
  capacity: z
    .number()
    .int()
    .positive("Muss positiv sein")
    .max(1000)
    .optional()
    .nullable(),
  weatherRelevant: z.boolean().default(false),
})

export const commentSchema = z.object({
  text: z.string().trim().min(1, "Kommentar darf nicht leer sein").max(1000),
})

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "Titel erforderlich").max(100),
  amount: z.number().positive("Betrag muss positiv sein").max(1_000_000),
  paidById: z.string().min(1, "Zahler erforderlich"),
})

export const carpoolSchema = z.object({
  seats: z.number().int().positive("Mind. 1 Platz").max(20),
  departureLocation: z.string().trim().min(1, "Abfahrtsort erforderlich").max(200),
  departureTime: z.string().min(1, "Abfahrtszeit erforderlich"),
})
