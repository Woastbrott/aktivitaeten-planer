"use client"

import { useActionState, useEffect, useOptimistic, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { Loader2, MessageCircle, Send } from "lucide-react"

import { addComment, type CommentFormState } from "@/lib/actions/comments"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { initials } from "@/lib/initials"
import type { ActivityDetail } from "@/lib/types"

const initialState: CommentFormState = {}

export function CommentsSection({
  activityId,
  comments,
  currentUserName,
}: {
  activityId: string
  comments: ActivityDetail["comments"]
  currentUserName: string
}) {
  const addCommentWithId = addComment.bind(null, activityId)
  const [state, formAction, isPending] = useActionState(
    addCommentWithId,
    initialState
  )
  const formRef = useRef<HTMLFormElement>(null)

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (current, text: string) => [
      ...current,
      {
        id: `optimistic-${Date.now()}`,
        activityId,
        userId: "optimistic",
        text,
        createdAt: new Date(),
        user: { id: "optimistic", name: currentUserName },
      },
    ]
  )

  useEffect(() => {
    if (!isPending && !state.error) {
      formRef.current?.reset()
    }
  }, [isPending, state.error])

  function handleSubmit(formData: FormData) {
    const text = formData.get("text")
    if (typeof text === "string" && text.trim()) {
      addOptimisticComment(text)
    }
    formAction(formData)
  }

  return (
    <div className="grid gap-4">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <MessageCircle className="size-4.5" />
        Kommentare ({optimisticComments.length})
      </h2>

      {optimisticComments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Noch keine Kommentare. Starte die Absprache!
        </p>
      ) : (
        <ul className="grid gap-3">
          {optimisticComments.map((comment) => {
            const isOptimistic = comment.id.startsWith("optimistic-")
            return (
              <li
                key={comment.id}
                className={cn(
                  "flex animate-in fade-in slide-in-from-bottom-1 gap-2.5 duration-300",
                  isOptimistic && "opacity-60"
                )}
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">
                    {initials(comment.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5 rounded-xl rounded-tl-sm bg-muted px-3 py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">
                      {comment.user.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {isOptimistic
                        ? "wird gesendet…"
                        : formatDistanceToNow(comment.createdAt, {
                            addSuffix: true,
                            locale: de,
                          })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <form ref={formRef} action={handleSubmit} className="flex items-start gap-2">
        <Textarea
          name="text"
          placeholder="Kommentar schreiben…"
          rows={1}
          required
          className="min-h-9 resize-none"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isPending}
          className="shrink-0"
          aria-label="Kommentar senden"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </form>
      {state.error && (
        <p className="-mt-2 text-sm text-destructive">{state.error}</p>
      )}
    </div>
  )
}
