import { z } from "zod"
import { Action, TypedActionResult } from "./types"
import { ActionError, getErrorMessage } from "./errors"

/**
 * Create a Zod-validated server form action.
 */
export async function typedAction<TResponse, TSchema extends z.Schema>({
  form,
  schema,
  onValidate,
  postValidate,
}: Action<TResponse, TSchema>): Promise<TypedActionResult<TResponse>> {
  const input =
    form instanceof FormData ? Object.fromEntries(form.entries()) : form

  const result = schema.safeParse(input)
  if (result.success === false) {
    return {
      status: "error",
      validationErrors: result.error.flatten().fieldErrors,
    }
  }

  /**
   * validate and execute callback
   * nextjs redirects use thrown promises, so using them inside a try-catch does not work
   */
  try {
    var response = await onValidate({ input: result.data })
  } catch (err) {
    if (err instanceof ActionError) {
      return err.result
    }

    return { status: "error", error: getErrorMessage(err) }
  }

  // post-validation hook to run any redirects etc
  if (postValidate) {
    postValidate({
      input: result.data,
      output: response,
    })
  }

  return { status: "success", data: response }
}
