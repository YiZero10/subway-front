import axios from "axios"

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? "http://localhost:8080" : "/api"
})

export const getStations = () => {
    return instance.get("/get");
}

export const getResults = (value, data) => {
    return instance.post(value ? "/cal" : "/dfs", data);
}
