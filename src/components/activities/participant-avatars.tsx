import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initials } from "@/lib/initials"
import { cn } from "@/lib/utils"

export function ParticipantAvatars({
  names,
  max = 5,
  size = "sm",
}: {
  names: string[]
  max?: number
  size?: "sm" | "md"
}) {
  if (names.length === 0) {
    return <p className="text-xs text-muted-foreground">Noch niemand dabei</p>
  }

  const visible = names.slice(0, max)
  const overflow = names.length - visible.length
  const dims = size === "sm" ? "size-7 text-[11px]" : "size-9 text-sm"

  return (
    <div className="flex -space-x-2">
      {visible.map((name, i) => (
        <Avatar
          key={i}
          className={cn(dims, "border-2 border-background")}
          title={name}
        >
          <AvatarFallback className="bg-secondary font-medium text-secondary-foreground">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 && (
        <Avatar className={cn(dims, "border-2 border-background")}>
          <AvatarFallback className="bg-muted font-medium text-muted-foreground">
            +{overflow}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
