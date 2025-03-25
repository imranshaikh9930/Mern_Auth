import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/auth",
})

export const googleAuth = (code)=> api.get(`/google?code=${code}`)