import { deleteTeam } from "./actions"
import { useTransition } from "react-dom"

export default function Component({ team }: { team: Team }) {
  const [isPending, startTransition] = useTransition()

  function destroy() {
    startTransition(async () => {
      const result = await deleteTeam(team.id)
      alert(
        result.status === "success" ? "Team deleted" : "Error deleting team",
      )
    })
  }

  return (
    <button type="button" disabled={isPending} onClick={destroy}>
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}
