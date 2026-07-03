"use server"

import { geocodeLocation, type GeocodeResult } from "@/lib/geocode"

export async function searchLocation(query: string): Promise<GeocodeResult[]> {
  return geocodeLocation(query)
}
