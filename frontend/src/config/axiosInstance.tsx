import axios from 'axios';

console.log('Axios instance created with base URL:', process.env.NEXT_PUBLIC_API_BASE_URL );

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL|| 'http://localhost:8000/api',
  withCredentials: true, // optional: if using cookies/sessions
});

export default axiosInstance;