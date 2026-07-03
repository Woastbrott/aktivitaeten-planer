"use client"

import { useActionState, useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { Loader2, MessageCircle, Send } from "lucide-react"

import { addComment, type CommentFormState } from "@/lib/actions/comments"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { initials } from "@/lib/initials"
import type { ActivityDetail } from "@/lib/types"

const initialState: CommentFormState = {}

export function CommentsSection({
  activityId,
  comments,
}: {
  activityId: string
  comments: ActivityDetail["comments"]
}) {
  const addCommentWithId = addComment.bind(null, activityId)
  const [state, formAction, isPending] = useActionState(
    addCommentWithId,
    initialState
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!isPending && !state.error) {
      formRef.current?.reset()
    }
  }, [isPending, state.error])

  return (
    <div className="grid gap-4">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <MessageCircle className="size-4.5" />
        Kommentare ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Noch keine Kommentare. Starte die Absprache!
        </p>
      ) : (
        <ul className="grid gap-3">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-2.5">
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
                    {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                      locale: de,
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form ref={formRef} action={formAction} className="flex items-start gap-2">
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
