import { z } from "zod"

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Nutzername muss mind. 3 Zeichen haben")
  .max(24, "Nutzername darf höchstens 24 Zeichen haben")
  .regex(/^[a-z0-9_-]+$/, "Nur Buchstaben, Zahlen, _ und - erlaubt")

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name muss mind. 2 Zeichen haben").max(60),
  username: usernameSchema,
  password: z.string().min(8, "Passwort muss mind. 8 Zeichen haben").max(72),
  inviteToken: z.string().optional(),
})

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "Passwort erforderlich"),
})

export const activitySchema = z.object({
  title: z.string().trim().min(2, "Titel ist zu kurz").max(100),
  description: z.string().trim().max(2000).optional().default(""),
  location: z.string().trim().max(200).optional().default(""),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  date: z.string().optional().nullable(),
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
  departureTime: z.string().optional().nullable(),
})
