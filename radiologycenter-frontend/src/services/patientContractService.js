import axios from 'axios';
import authService from './authService';
import { getApiUrl } from '../utils/config';

const API_URL = getApiUrl('/patient-contracts');

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

const create = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });
  return res.data;
};

const update = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
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

export default { getAll, getById, create, update, remove }; 