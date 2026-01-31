import api from "@/services/api"

export async function updateProfile(name) {
  const res = await api.put("/users/profile", { name })
  return res.data
}

export async function deleteAccount() {
  const res = await api.delete("/users/me")
  return res.data
}
