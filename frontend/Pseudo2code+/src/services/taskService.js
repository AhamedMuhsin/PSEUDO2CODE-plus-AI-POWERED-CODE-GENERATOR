import api from "@/services/api" // axios instance

export async function fetchSuggestedTasks() {
  const res = await api.get("/tasks/suggested")
  return res.data.tasks
}
