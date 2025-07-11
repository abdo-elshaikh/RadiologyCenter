import axios from 'axios';
import authService from './authService';
import { getApiUrl } from '../utils/config';

const API_URL = getApiUrl('/users');

const getAll = async () => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const update = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const remove = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const activate = async (id) => {
  const res = await axios.patch(`${API_URL}/${id}/activate`, {}, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const deactivate = async (id) => {
  const res = await axios.patch(`${API_URL}/${id}/deactivate`, {}, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

export default {
  getAll,
  update,
  remove,
  activate,
  deactivate,
}; 