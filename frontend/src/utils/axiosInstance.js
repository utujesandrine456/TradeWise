import axios from 'axios';
import { toast } from './toast';

const baseURL = import.meta.env.VITE_API_URL;
const gqlBaseURL = import.meta.env.VITE_GQL_URL;


export const backendApi = axios.create({
    baseURL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const backendGqlApi = axios.create({
    baseURL: gqlBaseURL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

backendApi.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);

        if (config.url === '/auth/login' || config.url === '/auth/register') {
            delete config.headers['Authorization'];
        }

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

backendApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        const message = error?.response?.data?.message || error.message || 'Request failed';

        // Skip toast if it is a 401 error from the initial GET /auth check 
        // because that simply means the user isn't logged in.
        const isAuthCheck = error.config?.url === '/auth' && error.config?.method === 'get' && error.response?.status === 401;

        if (!isAuthCheck && typeof toast !== 'undefined' && toast.error) {
            toast.error(message);
        }
        return Promise.reject(error);
    }
);

export default backendApi;