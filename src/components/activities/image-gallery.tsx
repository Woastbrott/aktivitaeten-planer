"use client"

import { useActionState, useRef, useTransition } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  addActivityImages,
  deleteActivityImage,
  type AddImagesState,
} from "@/lib/actions/images"
import { Button } from "@/components/ui/button"

const initialState: AddImagesState = {}

export function ImageGallery({
  activityId,
  images,
  canManage,
}: {
  activityId: string
  images: { id: string; path: string }[]
  canManage: boolean
}) {
  const addImagesWithId = addActivityImages.bind(null, activityId)
  const [state, formAction, isUploading] = useActionState(
    addImagesWithId,
    initialState
  )
  const formRef = useRef<HTMLFormElement>(null)
  const [isDeleting, startTransition] = useTransition()

  function handleDelete(imageId: string) {
    startTransition(async () => {
      try {
        await deleteActivityImage(activityId, imageId)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Bild konnte nicht gelöscht werden."
        )
      }
    })
  }

  if (images.length === 0 && !canManage) return null

  return (
    <div className="grid gap-3">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <ImagePlus className="size-4.5" />
        Bilder
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
          >
            <Image
              src={image.path}
              alt=""
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
            {canManage && (
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                disabled={isDeleting}
                onClick={() => handleDelete(image.id)}
                aria-label="Bild löschen"
                className="absolute top-1.5 right-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ))}

        {canManage && (
          <form ref={formRef} action={formAction} className="contents">
            <label
              htmlFor="images-upload"
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {isUploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" />
              )}
              <span className="text-xs font-medium">Bilder hinzufügen</span>
              <input
                id="images-upload"
                name="images"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={isUploading}
                onChange={() => formRef.current?.requestSubmit()}
              />
            </label>
          </form>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </div>
  )
}
