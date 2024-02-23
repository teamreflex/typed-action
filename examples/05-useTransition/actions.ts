import { typedAction } from "@teamreflex/typed-action"
import { z } from "zod"

const deleteTeamSchema = z.object({
  id: z.string().uuid(),
})

/**
 * Because the output of `onValidate` is available as the return value of the action, it's all accessible on the client.
 * `form` can be an arbitrary object, it doesn't need to be a FormData object.
 * Errors thrown will have their message pulled, and turned into a `ActionResultError`.
 */

export async function deleteTeam(id: string) {
  return typedAction({
    form: { id },
    schema: deleteTeamSchema,
    onValidate: async ({ input }) => {
      if (hasPermissionToDelete(id) === false) {
        throw new Error("You don't have permission to delete this team")
      }

      return await db.delete(teams).where(eq(teams.id, id))
    },
  })
}
