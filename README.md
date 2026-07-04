# Sommer-Aktivitäten-Planer

Eine private Web-App für eine feste Freundesgruppe, um Sommer-Aktivitäten vorzuschlagen, zu planen und zu tracken – inklusive Teilnahmestatus, Kostenaufteilung, Fahrgemeinschaften und Wetteranzeige.

## Tech-Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) mit Postgres (Prisma Postgres via Vercel Marketplace)
- [Auth.js (NextAuth)](https://authjs.dev) mit Credentials-Provider (Nutzername + Passwort, bcrypt-Hashing)
- [Open-Meteo](https://open-meteo.com) für Wetter- und Geocoding-Daten (kein API-Key nötig)

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen

Die Datei `.env` ist bereits mit funktionierenden Werten vorhanden (Prisma Postgres via Vercel Marketplace):

```bash
DATABASE_URL="postgres://...@db.prisma.io:5432/postgres?sslmode=require"
AUTH_SECRET="..."
```

`vercel env pull` holt die aktuellen Werte (inkl. `DATABASE_URL`) direkt aus dem verknüpften Vercel-Projekt. Für einen neuen `AUTH_SECRET` (z. B. bei einer eigenen DB-Instanz):

```bash
npx auth secret
```

### 3. Datenbank einrichten

```bash
npx prisma migrate dev
npx prisma db seed
```

Das Seed-Skript legt 5 Beispiel-User an (keine Beispiel-Aktivitäten – die App startet mit einer leeren Aktivitätenliste).

**Login-Daten der Beispiel-User** (Passwort für alle: `password123`):

- anna
- ben
- clara
- david
- elif

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

## Bild-Uploads

Bilder zu Aktivitäten werden in [Vercel Blob](https://vercel.com/docs/vercel-blob) gespeichert (öffentlicher Store, verknüpft über `BLOB_READ_WRITE_TOKEN`). Das funktioniert sowohl lokal als auch auf Vercel, ohne ein beschreibbares lokales Dateisystem vorauszusetzen.

Zulässig sind JPEG, PNG, WebP und GIF bis 5 MB pro Datei, maximal 8 Bilder pro Aktivität. Nur die Person, die eine Aktivität erstellt hat, kann Bilder hinzufügen oder entfernen.

## Funktionsumfang

- **Accounts**: Registrierung, Login (Nutzername + Passwort), Beitritt über Einladungslink
- **Aktivitäten**: Vorschlagen (inkl. Bilder), Kalender- und Listenansicht, Filter nach eigenen Aktivitäten, Teilnahmestatus (Dabei/Vielleicht/Abgesagt) ohne Teilnehmerlimit, Kommentare
- **Bilder**: Upload beim Erstellen und nachträglich auf der Detailseite, Galerie-Ansicht, Titelbild auf der Aktivitäts-Card
- **Kosten**: Ausgaben pro Aktivität erfassen (inkl. Bearbeiten/Löschen eigener Einträge), Kostenübersicht mit Anteil und Saldo pro Person, vereinfachter Schuldenausgleich ("wer schuldet wem")
- **Fahrgemeinschaften**: Anbieten (Sitzplätze, optionale Abfahrtszeit), beitreten, Übersicht wer noch eine Mitfahrgelegenheit braucht
- **Wetter**: Vorhersage für wetterrelevante Outdoor-Aktivitäten (bis 15 Tage im Voraus, sofern Ort und Datum feststehen)
- **Kalender-Export**: Aktivitäten mit Termin lassen sich als `.ics`-Datei herunterladen und direkt im Apple Kalender (oder jeder anderen Kalender-App) speichern

## Projektstruktur

```
prisma/                  Schema, Migrationen, Seed-Skript
src/app/(auth)/           Login, Registrierung, Einladungs-Landingpage
src/app/(app)/             Geschützter Bereich (Aktivitäten, Kalender, Einladen)
src/components/           UI-Komponenten (shadcn/ui + eigene Feature-Komponenten)
src/lib/actions/          Server Actions (Auth, Aktivitäten, Kommentare, Kosten, Fahrgemeinschaften, Einladungen)
src/lib/                  Utilities (Wetter, Geocoding, Schuldenausgleich, Validierung)
```
