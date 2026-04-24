import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_V1_BASE_URL || 'http://10.50.20.47:8081/api/v1';

const resourceService = {

  // Get all resources with optional filters
  getAllResources: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.location) params.append('location', filters.location);
    if (filters.status) params.append('status', filters.status);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
    const response = await axios.get(`${API_BASE}/resources?${params}`);
    return response.data;
  },

  // Get single resource by ID
  getResourceById: async (id) => {
    const response = await axios.get(`${API_BASE}/resources/${id}`);
    return response.data;
  },

  // Create new resource (Admin)
  createResource: async (resourceData) => {
    const response = await axios.post(`${API_BASE}/resources`, resourceData);
    return response.data;
  },

  // Update resource (Admin)
  updateResource: async (id, resourceData) => {
    const response = await axios.put(`${API_BASE}/resources/${id}`, resourceData);
    return response.data;
  },

  // Update status only (Admin)
  updateStatus: async (id, status) => {
    const response = await axios.patch(
      `${API_BASE}/resources/${id}/status?status=${status}`
    );
    return response.data;
  },

  // Delete resource (Admin)
  deleteResource: async (id) => {
    await axios.delete(`${API_BASE}/resources/${id}`);
  },

};

export default resourceService;