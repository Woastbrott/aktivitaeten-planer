"use client"

import { useBrainrot } from "@/components/brainrot-provider"
import { BRAINROT_EMOJI, BRAINROT_TICKER } from "@/lib/brainrot"

export function BrainrotFx() {
  const { active } = useBrainrot()

  if (!active) return null

  const tickerText = BRAINROT_TICKER.join("   •   ")

  return (
    <>
      <div className="brainrot-ticker" aria-hidden>
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        {BRAINROT_EMOJI.map((emoji, i) => (
          <span
            key={i}
            className="brainrot-float absolute text-3xl opacity-70"
            style={{
              left: `${(i * 137) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </>
  )
}
