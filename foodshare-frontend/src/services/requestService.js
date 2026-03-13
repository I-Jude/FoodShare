import api from './api';

const requestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/requests/receiver/my-requests');
    return response.data;
  },

  getIncomingRequests: async () => {
    const response = await api.get('/requests/donor/incoming');
    return response.data;
  },

  approveRequest: async (id) => {
    const response = await api.put(`/requests/${id}/approve`);
    return response.data;
  },

  rejectRequest: async (id) => {
    const response = await api.put(`/requests/${id}/reject`);
    return response.data;
  },

  markAsCompleted: async (id) => {
    const response = await api.put(`/requests/${id}/mark-completed`);
    return response.data;
  },

  cancelRequest: async (id) => {
    await api.delete(`/requests/${id}`);
  },
};

export default requestService;
