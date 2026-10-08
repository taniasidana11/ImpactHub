import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes('/api/auth/login');
    const isRegisterRoute = error.config?.url?.includes('/api/auth/register');

    if (
      error.response?.status === 401 &&
      !isLoginRoute &&
      !isRegisterRoute
    ) {
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data: object) =>
  API.post('/api/auth/register', data);

export const loginUser = (data: object) =>
  API.post('/api/auth/login', data);

export const getMe = () =>
  API.get('/api/auth/me');

export const logoutUser = () =>
  API.post('/api/auth/logout');

// NGOs
export const getAllNGOs = () =>
  API.get('/api/ngos');

export const getNGOById = (id: string) =>
  API.get(`/api/ngos/${id}`);

export const getMyNGO = () =>
  API.get('/api/ngos/me');

export const createNGO = (data: object) =>
  API.post('/api/ngos', data);

export const updateNGO = (id: string, data: object) =>
  API.put(`/api/ngos/${id}`, data);

// Events
export const getAllEvents = (params?: object) =>
  API.get('/api/events', { params });

export const getEventById = (id: string) =>
  API.get(`/api/events/${id}`);

export const createEvent = (data: object) =>
  API.post('/api/events', data);

export const updateEvent = (id: string, data: object) =>
  API.put(`/api/events/${id}`, data);

export const deleteEvent = (id: string) =>
  API.delete(`/api/events/${id}`);

// Volunteer
export const registerForEvent = (id: string) =>
  API.post(`/api/events/${id}/register`);

export const cancelRegistration = (id: string) =>
  API.delete(`/api/events/${id}/register`);

export const getMyEvents = () =>
  API.get('/api/volunteers/events');

// Admin
export const getAdminStats = () =>
  API.get('/api/admin/stats');

export const getAllNGORequests = () =>
  API.get('/api/admin/ngos');

export const verifyNGO = (id: string, verified: boolean) =>
  API.put(`/api/admin/ngos/${id}/verify`, { verified });

export const getAllUsers = () =>
  API.get('/api/admin/users');

export const deleteUser = (id: string) =>
  API.delete(`/api/admin/users/${id}`);

export const deleteEventAdmin = (id: string) =>
  API.delete(`/api/admin/events/${id}`);

export const uploadProfileImage = (formData: FormData) =>
  API.post('/api/upload/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const uploadCoverImage = (formData: FormData) =>
  API.post('/api/upload/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default API;