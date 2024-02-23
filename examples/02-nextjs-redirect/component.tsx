import { updateUser } from "./actions"
import { useFormState, useFormStatus } from "react-dom"

export default function Component() {
  const [state, formAction] = useFormState(updateUser, { status: "idle" })

  return (
    <form action={formAction}>
      {state.status === "error" && <div>{state.error}</div>}
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
