import { describe, test, expect } from "vitest"
import { typedAction } from "../src"
import { z } from "zod"
import type { ValidForm } from "../src/types"
import { ActionError } from "../src/errors"

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  age: z.coerce.number().positive(),
})

function getForm() {
  const form = new FormData()
  form.set("name", "Kyle")
  form.set("age", "27")
  return form
}

describe("parsing", () => {
  const parsingAction = async (form: ValidForm) =>
    typedAction({
      form,
      schema,
      onValidate: async ({ input }) => input,
    })

  test("action parses FormData correctly", async () => {
    const result = await parsingAction(getForm())
    expect(result).toEqual({
      status: "success",
      data: { name: "Kyle", age: 27 },
    })
  })

  test("action parses Record correctly", async () => {
    const result = await parsingAction({
      name: "Kyle",
      age: "27",
    })
    expect(result).toEqual({
      status: "success",
      data: { name: "Kyle", age: 27 },
    })
  })
})

describe("validation errors", () => {
  const validationErrorAction = async (form: ValidForm) =>
    typedAction({
      form,
      schema,
      onValidate: async ({ input }) => input,
    })

  test("action returns validation errors correctly", async () => {
    const form = getForm()
    form.set("name", "Ky")

    const result = await validationErrorAction(form)
    expect(result).toEqual({
      status: "error",
      validationErrors: { name: ["Name must be at least 3 characters long"] },
    })
  })
})

describe("thrown errors", () => {
  test("action returns thrown errors correctly", async () => {
    const thrownErrorAction = async (form: ValidForm) =>
      typedAction({
        form,
        schema,
        onValidate: async ({ input }) => {
          throw new Error("Something went wrong")
        },
      })

    const result = await thrownErrorAction(getForm())
    expect(result).toEqual({
      status: "error",
      error: "Something went wrong",
    })
  })

  test("action returns custom result from error", async () => {
    const customErrorAction = async (form: ValidForm) =>
      typedAction({
        form,
        schema,
        onValidate: async ({ input }) => {
          throw new ActionError({
            status: "error",
            validationErrors: { customValidation: ["Something went wrong"] },
          })
        },
      })

    const result = await customErrorAction(getForm())
    expect(result).toEqual({
      status: "error",
      validationErrors: { customValidation: ["Something went wrong"] },
    })
  })
})

describe("post-validate", () => {
  test("postValidate hook runs correctly", async () => {
    let count = 0

    const postValidateAction = async (form: ValidForm) =>
      typedAction({
        form,
        schema,
        onValidate: async ({ input }) => true,
        postValidate: () => {
          count++
        },
      })

    const result = await postValidateAction(getForm())

    expect(count).toBe(1)
    expect(result).toEqual({
      status: "success",
      data: true,
    })
  })
})
