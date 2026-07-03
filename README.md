# Sommer-Aktivitäten-Planer

Eine private Web-App für eine feste Freundesgruppe, um Sommer-Aktivitäten vorzuschlagen, zu planen und zu tracken – inklusive Teilnahmestatus, Kostenaufteilung, Fahrgemeinschaften und Wetteranzeige.

## Tech-Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) mit SQLite
- [Auth.js (NextAuth)](https://authjs.dev) mit Credentials-Provider (E-Mail + Passwort, bcrypt-Hashing)
- [Open-Meteo](https://open-meteo.com) für Wetter- und Geocoding-Daten (kein API-Key nötig)

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen

Die Datei `.env` ist bereits mit funktionierenden Entwicklungswerten vorhanden:

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="dev-only-secret-change-me-in-production-0123456789"
```

Für einen produktiven Einsatz sollte `AUTH_SECRET` durch einen zufälligen Wert ersetzt werden, z. B. mit:

```bash
npx auth secret
```

### 3. Datenbank einrichten

```bash
npx prisma migrate dev
npx prisma db seed
```

Das Seed-Skript legt 5 Beispiel-User sowie 4 Beispiel-Aktivitäten an (u. a. eine wetterrelevante Aktivität, eine mit Ausgaben und eine mit Fahrgemeinschaft).

**Login-Daten der Beispiel-User** (Passwort für alle: `password123`):

- anna@example.com
- ben@example.com
- clara@example.com
- david@example.com
- elif@example.com

Ein Beispiel-Einladungslink ist unter `/invite/demo-invite-token` erreichbar.

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft anschließend unter [http://localhost:3000](http://localhost:3000).

## Weitere Skripte

```bash
npm run build     # Produktions-Build
npm run start     # Produktions-Server starten
npm run lint      # ESLint
npm run db:seed   # Seed-Skript erneut ausführen
```

Um die Datenbank komplett zurückzusetzen (löscht alle Daten und führt Migrationen + Seed erneut aus):

```bash
npx prisma migrate reset
```

## Funktionsumfang

- **Accounts**: Registrierung, Login, Beitritt über Einladungslink
- **Aktivitäten**: Vorschlagen, Kalender- und Listenansicht, Filter nach Kategorie/eigenen Aktivitäten, Teilnahmestatus (Dabei/Vielleicht/Abgesagt), Kommentare
- **Kosten**: Ausgaben pro Aktivität erfassen, automatische Aufteilung auf Teilnehmer, vereinfachter Schuldenausgleich
- **Fahrgemeinschaften**: Anbieten, beitreten, Übersicht wer noch eine Mitfahrgelegenheit braucht
- **Wetter**: Vorhersage für wetterrelevante Outdoor-Aktivitäten (bis 15 Tage im Voraus, sofern Ort und Datum feststehen)

## Projektstruktur

```
prisma/                  Schema, Migrationen, Seed-Skript
src/app/(auth)/           Login, Registrierung, Einladungs-Landingpage
src/app/(app)/             Geschützter Bereich (Aktivitäten, Kalender, Einladen)
src/components/           UI-Komponenten (shadcn/ui + eigene Feature-Komponenten)
src/lib/actions/          Server Actions (Auth, Aktivitäten, Kommentare, Kosten, Fahrgemeinschaften, Einladungen)
src/lib/                  Utilities (Wetter, Geocoding, Schuldenausgleich, Validierung)
```
