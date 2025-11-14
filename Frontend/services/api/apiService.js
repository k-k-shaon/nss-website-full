import axios from 'axios';

// Support both proxy-based dev (baseURL '/api') and direct URL to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Enable cookies for session management
});

export const imgUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  // If API_ORIGIN provided (e.g., production or no proxy), prefix it. Otherwise return the path as-is for dev proxy.
  if (API_ORIGIN) {
    return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
  }
  return `${path.startsWith('/') ? '' : '/'}${path}`;
};

export const apiService = {
  // Events
  getEvents: () => api.get('/events').then(r => r.data),
  getEvent: (id) => api.get(`/events/${id}`).then(r => r.data),
  createEvent: (formData) =>
    api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  updateEvent: (id, formData) =>
    api.put(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteEvent: (id) => api.delete(`/events/${id}`).then(r => r.data),

  // Blogs
  getBlogs: () => api.get('/blogs').then(r => r.data),
  getBlog: (id) => api.get(`/blogs/${id}`).then(r => r.data),
  createBlog: (formData) =>
    api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  updateBlog: (id, formData) =>
    api.put(`/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`).then(r => r.data),

  // Carousel
  getCarousel: () => api.get('/carousel').then(r => r.data),
  createCarousel: (formData) =>
    api.post('/carousel', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  updateCarousel: (id, data) =>
    api.put(`/carousel/${id}`, data).then(r => r.data),
  reorderCarousel: (ids) =>
    api.post('/carousel/reorder', { ids }).then(r => r.data),
  deleteCarousel: (filename) => api.delete(`/carousel/${filename}`).then(r => r.data),

  // Messages
  getMessages: () => api.get('/admin/messages').then(r => r.data),
  createMessage: (data) => api.post('/admin/messages', data).then(r => r.data),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`).then(r => r.data),

  // Auth
  login: (email, password) => api.post('/admin/login', { email, password }).then(r => r.data),
  logout: () => api.post('/admin/logout').then(r => r.data),
  checkAuth: () => api.get('/admin/me').then(r => r.data),

  // Projects
  getProjects: () => api.get('/projects').then(r => r.data),
  getProject: (id) => api.get(`/projects/${id}`).then(r => r.data),
  createProject: (formData) =>
    api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  updateProject: (id, formData) =>
    api.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteProject: (id) => api.delete(`/projects/${id}`).then(r => r.data),

  // Alumni
  getAlumni: () => api.get('/alumni').then(r => r.data),
  getAlumniById: (id) => api.get(`/alumni/${id}`).then(r => r.data),
  createAlumni: (formData) =>
    api.post('/alumni', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  updateAlumni: (id, formData) =>
    api.put(`/alumni/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteAlumni: (id) => api.delete(`/alumni/${id}`).then(r => r.data),

  // Export imgUrl helper for use in components
  imgUrl,
};
