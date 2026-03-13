import api from './api';

const donationService = {
  getAllDonations: async () => {
    const response = await api.get('/donations');
    return response.data;
  },

  getDonationById: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  searchDonations: async (location, foodType, availableFrom) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (foodType) params.append('foodType', foodType);
    if (availableFrom) params.append('availableFrom', availableFrom);

    const response = await api.get(`/donations/search?${params}`);
    return response.data;
  },

  createDonation: async (donationData) => {
    const response = await api.post('/donations', donationData);
    return response.data;
  },

  updateDonation: async (id, donationData) => {
    const response = await api.put(`/donations/${id}`, donationData);
    return response.data;
  },

  deleteDonation: async (id) => {
    await api.delete(`/donations/${id}`);
  },

  getDonorDonations: async (donorId) => {
    const response = await api.get(`/donations/donor/${donorId}`);
    return response.data;
  },

  uploadImage: async (donationId, formData) => {
    const response = await api.post(`/donations/${donationId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default donationService;
