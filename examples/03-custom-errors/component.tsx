import { createTeam } from "./actions"
import { useState, useFormState, useFormStatus } from "react-dom"

export default function Component() {
  const [state, formAction] = useFormState(createTeam, { status: "idle" })
  const [slug, setSlug] = useState("")

  return (
    <form action={formAction}>
      <input type="text" name="name" onChange=((e) => setSlug(slugify(e.currentTarget.value))) />
      <input type="text" name="slug" value={slug} disabled readOnly />
      {state.status === "error" && state.validationErrors.slug?.length && (
        <div>{state.validationErrors.slug}</div>
      )}
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
