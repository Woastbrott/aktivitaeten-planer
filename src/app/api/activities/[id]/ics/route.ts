import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { buildIcsEvent } from "@/lib/ics"

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "aktivitaet"
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
  }

  const { id } = await params
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: { id: true, title: true, description: true, location: true, date: true },
  })

  if (!activity || !activity.date) {
    return NextResponse.json({ error: "Kein Termin vorhanden." }, { status: 404 })
  }

  const ics = buildIcsEvent({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    location: activity.location,
    date: activity.date,
  })

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugify(activity.title)}.ics"`,
    },
  })
}
