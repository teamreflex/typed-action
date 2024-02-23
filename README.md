# @teamreflex/typed-action

[![npm version](https://badgen.net/npm/v/@teamreflex/typed-action)](https://npm.im/@teamreflex/typed-action) [![npm downloads](https://badgen.net/npm/dm/@teamreflex/typed-action)](https://npm.im/@teamreflex/typed-action)

Convenience wrapper for Zod validation in React server actions.

## Install

```bash
npm i @teamreflex/typed-action
```

## Usage

Define a Zod schema for your form data:

```ts
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(3).max(64),
  email: z.string().email(),
})
```

Define a new action. This can be done as a const or function, if you wanted to mutate the form data before validation.

```ts
"use server"
import { typedAction } from "@teamreflex/typed-action"

export const updateUser = async (form: FormData) =>
  typedAction({
    form,
    schema: updateUserSchema,
    onValidate: async ({ input }) => {
      //                 ^? { name: string, email: string }
      return await db.update(users).set(input).where({ id: 1 })
    },
  })
```

Then use it in your React components:

```tsx
import { updateUser } from "./actions"

function UpdateUserForm() {
  return (
    <form action={updateUser} className="flex flex-col gap-2">
      <input type="text" name="name" />
      <input type="email" name="email" />
      <button type="submit">Update</button>
    </form>
  )
}
```

## `typedAction` Options

### `form`: `FormData | Record<string, unknown>`

Can be either a `FormData` or string-keyed object/Record. Objects allow for usage with `useTransition` usage of server actions, whereas `FormData` is more convenient for form submissions and required for `useFormState` usage.

### `schema`: `ZodObject`

Any Zod schema.

### `onValidate`: `({ input: T }) => Promise<R>`

An async function that executes upon a successful Zod validation. The input type `T` is inferred from the schema, and the return type `R` is inferred from the return type of the function.

### `postValidate`: `(({ input: T, output: R }) => void) | undefined`

An optional function that executes after the `onValidate` function. Because Nextjs's implementation of `redirect` and `notFound` results in throws, these can't be done in `onValidate` as they get caught. Instead, you can use `postValidate` to handle these cases.

`T` is the Zod validation output/input to `onValidate`, and `R` is the output of `onValidate`.

## Examples

| Link                                                  | Description                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| [01-useFormState](examples/01-useFormState)           | Using React's `useFormState` hook to render success/error status |
| [02-nextjs-redirect](examples/02-nextjs-redirect)     | Perform a redirect using Next's `redirect` helper                |
| [03-custom-errors](examples/03-custom-errors)         | Throw errors manually to seamlessly use the same state           |
| [04-helper-components](examples/04-helper-components) | Examples of helper components to make errors easier to render    |
| [05-useTransition](examples/05-useTransition)         | Server actions don't always need to be forms                     |

## License

MIT &copy; [Reflex](https://github.com/teamreflex)
