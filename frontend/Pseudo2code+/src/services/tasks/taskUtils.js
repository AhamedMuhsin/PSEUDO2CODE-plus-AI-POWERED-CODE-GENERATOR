// src/services/tasks/taskUtils.js
export const isTaskEligible = (task, user) => {
  try {
    return task.when(user)
  } catch {
    return false
  }
}

export const isTaskCompleted = (task, user) => {
  try {
    return task.completed(user)
  } catch {
    return false
  }
}
