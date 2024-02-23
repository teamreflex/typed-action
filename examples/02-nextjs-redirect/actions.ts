import { typedAction } from "@teamreflex/typed-action"
import { z } from "zod"
import { redirect } from "next/navigation"

const updateUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
})

/**
 * Because the validated data and the output of `onValidate` are passed into `postValidate`,
 * you can use them to craft redirect URLs based on the result of the action.
 */

export async function updateUser(prev: unknown, form: FormData) {
  return typedAction({
    form,
    schema: updateUserSchema,
    onValidate: async ({ input }) => {
      await db.update(users).set(input).where({ id: 1 })
    },
    postValidate: ({ input, output }) => {
      redirect(`/profile/${output.id}`)
    },
  })
}
