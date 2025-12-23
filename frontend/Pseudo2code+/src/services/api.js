import { auth } from "@/firebase";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

export async function fetchUserProfile() {
  const token = await auth.currentUser.getIdToken();

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}
