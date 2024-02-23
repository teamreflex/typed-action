import { z } from "zod"

export type ActionResultSuccess<T> = {
  status: "success"
  data: T
}

export type ActionResultError = {
  status: "error"
  error?: string
  validationErrors?: Record<string, string[] | undefined>
}

export type ActionResultIdle = {
  status: "idle"
}

export type TypedActionResult<T> =
  | ActionResultSuccess<T>
  | ActionResultError
  | ActionResultIdle

export type ValidForm = FormData | Record<string, unknown>

export type Action<TResponse, TSchema extends z.Schema> = {
  /** Input data */
  form: ValidForm

  /** Zod schema to validate the input */
  schema: TSchema

  /** Callback to execute on validation success */
  onValidate: ({ input }: { input: z.infer<TSchema> }) => Promise<TResponse>

  /** Optionally run anything on callback success */
  postValidate?: ({
    input,
    output,
  }: {
    input: z.infer<TSchema>
    output: TResponse
  }) => void
}
