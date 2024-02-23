import { typedAction } from "@teamreflex/typed-action"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
})

/**
 * Whatever `onValidate` returns, will be available in the `data` property of the output TypedActionResult object.
 */

export async function updateUser(prev: unknown, form: FormData) {
  return typedAction({
    form,
    schema: updateUserSchema,
    onValidate: async ({ input }) => {
      await db.update(users).set(input).where({ id: 1 })
      return {
        message: "Your profile has been updated successfully!",
      }
    },
  })
}
