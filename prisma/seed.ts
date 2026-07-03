import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

function daysFromNow(days: number, hour: number, minute = 0): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date
}

async function main() {
  console.log("Seeding database…")

  const passwordHash = await bcrypt.hash("password123", 10)

  const [anna, ben, clara, david, elif] = await Promise.all(
    [
      { name: "Anna Berger", email: "anna@example.com" },
      { name: "Ben Fischer", email: "ben@example.com" },
      { name: "Clara Novak", email: "clara@example.com" },
      { name: "David Krüger", email: "david@example.com" },
      { name: "Elif Aydin", email: "elif@example.com" },
    ].map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, passwordHash },
      })
    )
  )

  await prisma.invite.upsert({
    where: { token: "demo-invite-token" },
    update: {},
    create: { token: "demo-invite-token", createdById: anna.id },
  })

  // 1) Wetterrelevante Aktivität: Baden am Bodensee (mit echten Koordinaten)
  const baden = await prisma.activity.create({
    data: {
      title: "Baden am Bodensee",
      description:
        "Nachmittag am Strandbad Konstanz – Handtuch, Sonnencreme und gute Laune mitbringen!",
      category: "BADEN",
      location: "Strandbad Konstanz",
      lat: 47.6603,
      lng: 9.1758,
      date: daysFromNow(3, 14, 0),
      capacity: 12,
      weatherRelevant: true,
      createdById: anna.id,
      participations: {
        create: [
          { userId: anna.id, status: "GOING" },
          { userId: ben.id, status: "GOING" },
          { userId: clara.id, status: "MAYBE" },
          { userId: david.id, status: "GOING" },
        ],
      },
      comments: {
        create: [
          { userId: ben.id, text: "Ich bring den Beachvolleyball mit!" },
          { userId: clara.id, text: "Gibt's in der Nähe einen Kiosk?" },
        ],
      },
    },
  })

  // 2) Aktivität mit Kosten: Grillabend
  const grillen = await prisma.activity.create({
    data: {
      title: "Grillabend im Park",
      description: "Gemütlicher Grillabend – jeder bringt etwas zum Grillen mit.",
      category: "GRILLEN",
      location: "Stadtpark, Grillwiese Ost",
      date: daysFromNow(7, 18, 30),
      weatherRelevant: false,
      createdById: ben.id,
      participations: {
        create: [
          { userId: anna.id, status: "GOING" },
          { userId: ben.id, status: "GOING" },
          { userId: clara.id, status: "GOING" },
          { userId: elif.id, status: "GOING" },
        ],
      },
      expenses: {
        create: [
          { title: "Kohle & Grillkorb", amount: 2400, paidById: ben.id },
          { title: "Getränke", amount: 1850, paidById: anna.id },
          { title: "Fleisch & Grillkäse", amount: 3620, paidById: clara.id },
        ],
      },
    },
  })

  // 3) Aktivität mit Fahrgemeinschaft: Wanderung
  const wandern = await prisma.activity.create({
    data: {
      title: "Wanderung zum Aussichtspunkt",
      description: "Rundwanderung mit Einkehr in der Berghütte, ca. 4 Stunden.",
      category: "WANDERN",
      location: "Wanderparkplatz Hochkopf",
      lat: 47.7167,
      lng: 8.3833,
      date: daysFromNow(10, 9, 0),
      weatherRelevant: true,
      createdById: clara.id,
      participations: {
        create: [
          { userId: clara.id, status: "GOING" },
          { userId: david.id, status: "GOING" },
          { userId: elif.id, status: "GOING" },
          { userId: anna.id, status: "MAYBE" },
        ],
      },
      carpools: {
        create: [
          {
            driverId: david.id,
            seats: 3,
            departureLocation: "Bahnhofsvorplatz",
            departureTime: daysFromNow(10, 8, 15),
            passengers: { create: [{ userId: elif.id }] },
          },
        ],
      },
    },
  })

  // 4) Aktivität ohne festes Datum
  const festival = await prisma.activity.create({
    data: {
      title: "Sommerfestival-Wochenende",
      description:
        "Idee: gemeinsam zu einem Open-Air-Festival fahren, Termin hängt noch von Ticketverfügbarkeit ab.",
      category: "FESTIVAL",
      location: "",
      date: null,
      weatherRelevant: false,
      createdById: elif.id,
      participations: {
        create: [
          { userId: elif.id, status: "GOING" },
          { userId: ben.id, status: "MAYBE" },
        ],
      },
    },
  })

  console.log("Seed abgeschlossen:")
  console.log({
    users: [anna.email, ben.email, clara.email, david.email, elif.email],
    activities: [baden.title, grillen.title, wandern.title, festival.title],
    password: "password123 (für alle Beispiel-User)",
    inviteLink: "/invite/demo-invite-token",
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
