import axios from 'axios';
import authService from './authService';
import { getApiUrl } from '../utils/config';

const API_URL = getApiUrl('/api/unit');

const getAll = async () => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const getPaged = async (pageNumber = 1, pageSize = 10, name = null) => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  
  if (name) params.append('name', name);
  
  const res = await axios.get(`${API_URL}/paged?${params}`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const create = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });
  return res.data;
};

const update = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, { ...data, id }, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });
  return res.data;
};

const remove = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

export default { getAll, getById, getPaged, create, update, remove };