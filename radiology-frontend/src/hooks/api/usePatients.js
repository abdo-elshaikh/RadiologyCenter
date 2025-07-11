import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '../../lib/api';
import toast from 'react-hot-toast';

// Query keys
export const patientKeys = {
  all: ['patients'],
  lists: () => [...patientKeys.all, 'list'],
  list: (filters) => [...patientKeys.lists(), { filters }],
  details: () => [...patientKeys.all, 'detail'],
  detail: (id) => [...patientKeys.details(), id],
};

// Get all patients
export function usePatients(filters = {}) {
  return useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.pageNumber) params.append('pageNumber', filters.pageNumber);
      if (filters.pageSize) params.append('pageSize', filters.pageSize);
      if (filters.name) params.append('name', filters.name);
      if (filters.phone) params.append('phone', filters.phone);
      
      const endpoint = Object.keys(filters).length > 0 
        ? `${endpoints.patients.paged}?${params}`
        : endpoints.patients.list;
        
      const response = await api.get(endpoint);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get patient by ID
export function usePatient(id) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(endpoints.patients.byId(id));
      return response.data;
    },
    enabled: !!id,
  });
}

// Create patient
export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patientData) => {
      const response = await api.post(endpoints.patients.create, patientData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      toast.success('Patient created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create patient');
    },
  });
}

// Update patient
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...patientData }) => {
      const response = await api.put(endpoints.patients.update(id), patientData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
      toast.success('Patient updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update patient');
    },
  });
}

// Delete patient
export function useDeletePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(endpoints.patients.delete(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      toast.success('Patient deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete patient');
    },
  });
}