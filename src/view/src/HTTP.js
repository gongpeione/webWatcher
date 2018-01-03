import axios from 'axios';

export default axios.create({
    timeout: 5000,
    withCredentials: true,
    baseURL: process.env.NODE_ENV.toLowerCase() === 'development' ? 
                'http://localhost:3011/' : '/'
});