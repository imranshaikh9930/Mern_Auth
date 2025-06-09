import axios from "axios";

export const api = axios.create({
    baseURL: "https://mern-auth-1-pavq.onrender.com/auth",
})

export const googleAuth = (code)=> api.get(`/google?code=${code}`)

