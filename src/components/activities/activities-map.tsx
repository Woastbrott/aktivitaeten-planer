"use client"

import "leaflet/dist/leaflet.css"

import { useEffect, useMemo } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import Link from "next/link"

export type ActivityMapPoint = {
  id: string
  title: string
  lat: number
  lng: number
}

const GERMANY_CENTER: [number, number] = [51.1657, 10.4515]

// Custom pin instead of Leaflet's default marker image — avoids the classic
// "broken marker icon path under bundlers" issue entirely and matches the
// app's own accent color.
function createPinIcon() {
  return L.divIcon({
    className: "",
    html: `
      <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.35))">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill="var(--color-primary)" />
        <circle cx="15" cy="15" r="6" fill="white" />
      </svg>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  })
}

function MapController({ points }: { points: ActivityMapPoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 13)
    } else if (points.length > 1) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 })
    }
  }, [map, points])

  // The map is inside a container that can be hidden (mobile list/map
  // toggle) or resized (desktop sidebar). Leaflet only measures its
  // container when it thinks something changed, so without this it can
  // render blank/mis-sized after being revealed.
  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])

  return null
}

export function ActivitiesMap({ points }: { points: ActivityMapPoint[] }) {
  const icon = useMemo(() => createPinIcon(), [])

  return (
    <MapContainer
      center={GERMANY_CENTER}
      zoom={5}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapController points={points} />
      {points.map((point) => (
        <Marker key={point.id} position={[point.lat, point.lng]} icon={icon}>
          <Popup>
            <div className="grid gap-1.5">
              <p className="font-medium">{point.title}</p>
              <Link
                href={`/activities/${point.id}`}
                className="text-sm text-primary underline underline-offset-2"
              >
                Details ansehen
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
