import axios from 'axios';

const API_URL = 'http://localhost:8080/api/delivery';

const getDeliveryOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const deliveryService = {
  getDeliveryOrders
};

export default deliveryService;
