import api from "@/services/api"

export async function updateProfile(payload) {
  const res = await api.put("/users/profile", payload)
  return res.data
}

export async function changePassword(payload) {
  const res = await api.post("/users/password", payload)
  return res.data
}

export async function deleteAccount() {
  const res = await api.delete("/users/me")
  return res.data
}
