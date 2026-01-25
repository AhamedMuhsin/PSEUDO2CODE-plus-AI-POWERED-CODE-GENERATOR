import axios from '@/services/api'

export async function fetchMe() {
  const res = await axios.get('/me')
  return res.data
}
