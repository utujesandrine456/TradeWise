import axios from 'axios';

const backendApi = axios.create({
    baseURL: "http://localhost:2015/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default backendApi;