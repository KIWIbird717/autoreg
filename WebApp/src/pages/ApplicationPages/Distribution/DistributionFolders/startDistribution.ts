import axios from "axios"

export default async function startDistribution(id: string) {
  const API_BASE_URL = process.env.REACT_APP_PYTHON_SERVER_END_POINT
  try {
    await axios.get(`${API_BASE_URL}/api/sender`, {
      params: {
        sender_project_id: id,
        action: 'start'
      }
    })
  } catch (error) {
    console.error(error)
  }
}