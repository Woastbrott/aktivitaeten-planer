const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000 // 2h, since only a start time is tracked

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

export function buildIcsEvent({
  id,
  title,
  description,
  location,
  date,
}: {
  id: string
  title: string
  description: string
  location: string
  date: Date
}): string {
  const dtStamp = formatIcsDate(new Date())
  const dtStart = formatIcsDate(date)
  const dtEnd = formatIcsDate(new Date(date.getTime() + DEFAULT_DURATION_MS))

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sommer-Planer//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${id}@sommer-planer`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(title)}`,
  ]

  if (description) lines.push(`DESCRIPTION:${escapeIcsText(description)}`)
  if (location) lines.push(`LOCATION:${escapeIcsText(location)}`)

  lines.push("END:VEVENT", "END:VCALENDAR")

  return lines.join("\r\n")
}
