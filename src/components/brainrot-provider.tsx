"use client"

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react"

const STORAGE_KEY = "brainrot-mode"
const CHANGE_EVENT = "brainrot-mode-change"

// `storage` events only fire in *other* tabs, never the tab that made the
// write, so toggling dispatches this custom event to notify our own
// subscriber too.
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) === "1"
}

// The server has no localStorage, so it always renders "off" — the real
// preference (if any) is picked up on the client's first paint via
// useSyncExternalStore, without needing a setState-in-effect workaround.
function getServerSnapshot() {
  return false
}

function setStoredActive(next: boolean) {
  localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

const BrainrotContext = createContext<{
  active: boolean
  toggle: () => void
}>({ active: false, toggle: () => {} })

export function BrainrotProvider({ children }: { children: ReactNode }) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.classList.toggle("brainrot", active)
    document.title = active
      ? "🚽 Skibidi Sommer-Planer"
      : "Sommer-Aktivitäten-Planer"
  }, [active])

  function toggle() {
    setStoredActive(!active)
  }

  return (
    <BrainrotContext.Provider value={{ active, toggle }}>
      {children}
    </BrainrotContext.Provider>
  )
}

export function useBrainrot() {
  return useContext(BrainrotContext)
}
