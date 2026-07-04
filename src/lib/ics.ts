const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000 // 2h, since only a start time is tracked

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

// Timestamp of ics generation itself — a real instant, so UTC ("Z") is correct here.
function formatIcsTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

// Activity dates are captured and displayed as plain local wall-clock time
// (no timezone is ever collected from the user). Emitting them with a "Z"
// suffix would mark them as UTC, causing calendar apps to convert them into
// the viewer's timezone and shift the event by the local UTC offset. Using a
// floating local time (no "Z", no TZID) keeps it shown exactly as entered.
function formatIcsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`
  )
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
  const dtStamp = formatIcsTimestamp(new Date())
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
