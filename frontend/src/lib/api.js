import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.withCredentials = true;

export function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }
    const apiURL = import.meta.env.VITE_API_URL || '';
    const normalizedApiURL = apiURL.endsWith('/') ? apiURL.slice(0, -1) : apiURL;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedApiURL}${normalizedPath}`;
}

