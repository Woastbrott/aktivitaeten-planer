"use client"

import { useBrainrot } from "@/components/brainrot-provider"
import { brainrotLabel } from "@/lib/brainrot"

// Wraps a single piece of known, static UI chrome text (never user data) so
// it can flip to its brainrot equivalent while brainrot mode is active.
export function BrainrotText({ children }: { children: string }) {
  const { active } = useBrainrot()
  return <>{active ? brainrotLabel(children) : children}</>
}
