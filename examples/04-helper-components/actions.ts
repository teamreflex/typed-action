import { typedAction, ActionError } from "@teamreflex/typed-action"
import { z } from "zod"
import { redirect } from "next/navigation"

const createTeamSchema = z.object({
  name: z.string().min(3),
})

export async function createTeam(prev: unknown, form: FormData) {
  form.set("slug", slugify(form.get("name")))

  return typedAction({
    form,
    schema: createTeamSchema,
    onValidate: async ({ input }) => {
      if (slugIsTaken(input.slug)) {
        throw new ActionError({
          result: "error",
          validationErrors: {
            slug: "This slug is already taken",
          },
        })
      }

      return await db.insert(teams).values(input)
    },
    postValidate: ({ output }) => {
      redirect(`/team/${output.slug}`)
    },
  })
}
