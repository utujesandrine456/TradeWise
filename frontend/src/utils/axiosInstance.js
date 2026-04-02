<<<<<<< HEAD
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

=======
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:2009/api';

const backendApi = axios.create({
    baseURL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for debugging
backendApi.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        console.log('Request data:', config.data);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
backendApi.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        const message = error?.response?.data?.message || error.message || 'Request failed';
        toast.error(message);
        return Promise.reject(error);
    }
);

>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
export default backendApi;