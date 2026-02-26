import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://front-school-strapi.ktsdev.ru/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
