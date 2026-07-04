"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

export function FlashErrorToast({ message }: { message: string }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    toast.error(message)
    router.replace(pathname)
    // Only ever meant to fire once for the message present on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
