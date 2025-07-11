import axios from 'axios';
import authService from './authService';
import { getApiUrl } from '../utils/config';

const API_URL = getApiUrl('/api/accounting');

const getFinancialReports = async () => {
  const res = await axios.get(`${API_URL}/reports`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const getPayments = async () => {
  const res = await axios.get(`${API_URL}/payments`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const getAllPayments = async () => {
  const res = await axios.get(`${API_URL}/payments/all`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const getPaymentById = async (id) => {
  const res = await axios.get(`${API_URL}/payments/${id}`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

const addPayment = async (data) => {
  const res = await axios.post(`${API_URL}/payments`, data, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });
  return res.data;
};

const updatePayment = async (id, data) => {
  const res = await axios.put(`${API_URL}/payments/${id}`, { ...data, id }, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });
  return res.data;
};

const deletePayment = async (id) => {
  const res = await axios.delete(`${API_URL}/payments/${id}`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
  return res.data;
};

export default { 
  getFinancialReports, 
  getPayments, 
  getAllPayments, 
  getPaymentById, 
  addPayment, 
  updatePayment, 
  deletePayment 
};