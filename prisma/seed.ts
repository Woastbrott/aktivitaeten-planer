import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database…")

  const passwordHash = await bcrypt.hash("password123", 10)

  const [anna] = await Promise.all(
    [
      { name: "Anna Berger", username: "anna" },
      { name: "Ben Fischer", username: "ben" },
      { name: "Clara Novak", username: "clara" },
      { name: "David Krüger", username: "david" },
      { name: "Elif Aydin", username: "elif" },
    ].map((u) =>
      prisma.user.upsert({
        where: { username: u.username },
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

  console.log("Seed abgeschlossen:")
  console.log({
    usernames: ["anna", "ben", "clara", "david", "elif"],
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
