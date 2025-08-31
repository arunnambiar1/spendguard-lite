import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const client = axios.create({ baseURL : API})

// Call when have token to send on every request
export function setAuthToken(token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem('token', token)
}

//Remove token on logout
export function clearAuthToken() {
    delete client.defaults.headers.common.Authorization
    localStorage.removeItem('token')
}

export async function login(credentials) {
    const { data } = await client.post('/auth/login', credentials)
    return data
}

export async function register(details) {
    const { data } = await client.post('/auth/register', details)
    return data
}

export default client