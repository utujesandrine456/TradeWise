import axios from 'axios';

const backendPort = "2015"

export const backendApi = axios.create({
    baseURL: "https://tradewise-backend-v2.onrender.com/api",
    // baseURL: `http://localhost:${backendPort}/api`,
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const backendGqlApi = axios.create({
    baseURL: "https://tradewise-backend-v2.onrender.com/graphql",
    // baseURL: `http://localhost:${backendPort}/graphql`,
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default backendApi;