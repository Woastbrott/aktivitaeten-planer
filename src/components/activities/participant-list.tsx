import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initials } from "@/lib/initials"
import type { ActivityDetail } from "@/lib/types"

const GROUPS: { status: "GOING" | "MAYBE" | "DECLINED"; label: string }[] = [
  { status: "GOING", label: "Dabei" },
  { status: "MAYBE", label: "Vielleicht" },
  { status: "DECLINED", label: "Abgesagt" },
]

export function ParticipantList({
  participations,
}: {
  participations: ActivityDetail["participations"]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {GROUPS.map((group) => {
        const people = participations.filter((p) => p.status === group.status)
        return (
          <div key={group.status} className="grid gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              {group.label} ({people.length})
            </p>
            {people.length === 0 ? (
              <p className="text-sm text-muted-foreground/70">–</p>
            ) : (
              <ul className="grid gap-1.5">
                {people.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-sm">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-secondary text-[10px] font-medium text-secondary-foreground">
                        {initials(p.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {p.user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
