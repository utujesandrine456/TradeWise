import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:2015/api";
const gqlBaseURL = import.meta.env.VITE_GQL_URL || "http://localhost:2015/graphql";

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
        if (typeof toast !== 'undefined' && toast.error) {
            toast.error(message);
        }
        return Promise.reject(error);
    }
);

export default backendApi;