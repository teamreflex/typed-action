import { typedAction, ActionError } from "@teamreflex/typed-action"
import { z } from "zod"
import { redirect } from "next/navigation"

const createTeamSchema = z.object({
  name: z.string().min(3),
})

/**
 * You might have some custom validation logic that you want to run on the server.
 * So you can throw an `ActionError` to return a custom error message to the client.
 */

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
