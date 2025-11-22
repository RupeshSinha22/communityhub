import apiClient from './client.js';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const userAPI = {
  getProfile: (userId) => apiClient.get(`/users/profile/${userId}`),
  updateProfile: (data) => apiClient.patch('/users/profile', data),
  getAllUsers: () => apiClient.get('/users'),
};

export const communityAPI = {
  create: (data) => apiClient.post('/communities', data),
  getAll: () => apiClient.get('/communities'),
  getById: (id) => apiClient.get(`/communities/${id}`),
  getMy: () => apiClient.get('/communities/my'),
  update: (id, data) => apiClient.patch(`/communities/${id}`, data),
  delete: (id) => apiClient.delete(`/communities/${id}`),
  join: (id) => apiClient.post(`/communities/${id}/join`),
  leave: (id) => apiClient.post(`/communities/${id}/leave`),
};

export const postAPI = {
  create: (data) => apiClient.post('/posts', data),
  getById: (id) => apiClient.get(`/posts/${id}`),
  getFeed: () => apiClient.get('/posts/feed'),
  getByCommunity: (communityId) => apiClient.get(`/posts/community/${communityId}`),
  update: (id, data) => apiClient.patch(`/posts/${id}`, data),
  delete: (id) => apiClient.delete(`/posts/${id}`),
  like: (id) => apiClient.post(`/posts/${id}/like`),
  unlike: (id) => apiClient.delete(`/posts/${id}/like`),
};

export const commentAPI = {
  create: (data) => apiClient.post('/comments', data),
  getByPost: (postId) => apiClient.get(`/comments/post/${postId}`),
  getById: (id) => apiClient.get(`/comments/${id}`),
  update: (id, data) => apiClient.patch(`/comments/${id}`, data),
  delete: (id) => apiClient.delete(`/comments/${id}`),
  like: (id) => apiClient.post(`/comments/${id}/like`),
  unlike: (id) => apiClient.delete(`/comments/${id}/like`),
};

