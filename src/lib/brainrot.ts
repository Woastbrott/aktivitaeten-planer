// Reference: Italian Brainrot (Tralalero Tralala, Bombardiro Crocodilo, Lirili
// Larila, Ballerina Cappuccina), Tung Tung Tung Sahur, Skibidi Toilet
// (Cameraman/Speakerman/TV Man vs. the Toilets), and Gen Alpha slang
// (rizz, gyatt, fanum tax, Ohio, sigma).

export const BRAINROT_TICKER: string[] = [
  "🚽 SKIBIDI TOILET ORDER 66 🚽",
  "TUNG TUNG TUNG TUNG TUNG TUNG SAHUR 🪵",
  "BOMBARDIRO CROCODILO 🐊✈️ HAS ENTERED THE ACTIVITY",
  "TRALALERO TRALALERO 🦈👟 ONLY IN OHIO",
  "this activity has MASSIVE rizz fr fr no cap 💯",
  "LIRILI LARILA 🐘🌵 elephant cactus behavior",
  "BALLERINA CAPPUCCINA 💃☕ approved this Aktivität",
  "gyattttt is that a NEW ACTIVITY 😱",
  "sigma grindset: RSVP before someone fanum taxes your spot",
  "it's giving Ohio final boss energy 🌀",
  "SKIBIDI DOP DOP DOP YES YES 🚽🎤",
  "mewing so hard the calendar shifted timezones",
  "BRAINROT MODE: activated. Aktivitäten-Planer: still functional 🧠💀",
]

export const BRAINROT_EMOJI: string[] = [
  "🚽", "🐊", "🦈", "🪥", "👟", "🥁", "🌵", "🐘", "💀", "🧠", "☕", "💃", "🎤", "📷",
]

// Curated, whitelist-only swaps for static UI chrome (nav labels, headings,
// brand text). Never touches user-entered data (titles, comments, names).
const BRAINROT_LABELS: Record<string, string> = {
  "Sommer-Planer": "Skibidi Sommer-Planer 🚽",
  Aktivitäten: "Skibidi Sessions",
  Kalender: "Ohio Kalender",
  Neu: "Gyatt Alert",
  Einladen: "Fanum Rizz-Invite",
  "Neue Aktivität": "New Ohio Rizz Session",
  "Bist du dabei?": "Bist du sigma genug dabei? 🗿",
  Dabei: "Skibidi yes",
  Vielleicht: "Mewing on it",
  Abgesagt: "It's so Ohio, nein",
  "Meine Aktivitäten": "Nur meine Fanum Sessions",
}

export function brainrotLabel(original: string): string {
  return BRAINROT_LABELS[original] ?? original
}
