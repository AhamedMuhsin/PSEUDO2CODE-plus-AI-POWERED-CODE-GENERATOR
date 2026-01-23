import { TASK_DEFINITIONS } from './taskDefinitions'

export function resolveSuggestedTasks(user, limit = 4) {
  if (!user) return []

  return TASK_DEFINITIONS
    .filter(task => {
      // ⛔ once task already completed by data
      if (task.once && typeof task.condition === "function") {
        return task.condition(user)
      }

      // normal condition
      if (typeof task.condition === "function") {
        return task.condition(user)
      }

      return true
    })
    .sort((a, b) => {
      const pa = typeof a.priority === "function" ? a.priority(user) : 0
      const pb = typeof b.priority === "function" ? b.priority(user) : 0
      return pb - pa
    })
    .slice(0, limit)
}
