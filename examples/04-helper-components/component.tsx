import { createTeam } from "./actions"
import { useFormState, useFormStatus } from "react-dom"
import { FormError, FieldError } from "./form-helpers"

/**
 * Instead of manually checking `state.status` every time for errors,
 * you can build your own helpers that abstract it all away.
 * FormError and FieldError examples can be found in ./form-helpers.tsx
 * This can easily be extended to complete <Form /> and <Field /> components if necessary.
 */

export default function Component() {
  const [state, formAction] = useFormState(createTeam, { status: "idle" })

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <FormError state={state} className="py-2" />

      <div className="flex flex-col">
        <input type="text" name="name" />
        <FieldError state={state} field="name" />
      </div>

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
