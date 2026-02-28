import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL,
});

// Request Interceptor: add the token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: refresh token if 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loop by not retrying auth requests themselves
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const res = await axios.post(`${baseURL}/auth/refresh/`, { refresh: refreshToken });
                localStorage.setItem('access_token', res.data.access);

                originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                return api(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
