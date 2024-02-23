import { updateUser } from "./actions"
import { useFormState, useFormStatus } from "react-dom"

/**
 * `state` is a TypedActionResult object.
 * Use { status: "idle" } as initialState for useFormState.
 * This will change whenever the form is successful or throws an error.
 */

export default function Component() {
  const [state, formAction] = useFormState(updateUser, { status: "idle" })

  return (
    <form action={formAction}>
      {state.status === "error" && <div>{state.error}</div>}
      {state.status === "success" && <div>{state.data.message}</div>}
      <input type="text" name="name" />
      <input type="email" name="email" />
      <Submit />
    </form>
  )
}

function Submit() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  )
}
