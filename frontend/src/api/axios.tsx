import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const login = localStorage.getItem('username')
    if (login) {
        config.headers['X-User-Login'] = login
    }
    return config
})

export default api;
