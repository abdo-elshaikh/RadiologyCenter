import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '../../lib/api';
import toast from 'react-hot-toast';

// Query keys
export const appointmentKeys = {
  all: ['appointments'],
  lists: () => [...appointmentKeys.all, 'list'],
  list: (filters) => [...appointmentKeys.lists(), { filters }],
  details: () => [...appointmentKeys.all, 'detail'],
  detail: (id) => [...appointmentKeys.details(), id],
};

// Get all appointments
export function useAppointments(filters = {}) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.pageNumber) params.append('pageNumber', filters.pageNumber);
      if (filters.pageSize) params.append('pageSize', filters.pageSize);
      if (filters.unitId) params.append('unitId', filters.unitId);
      if (filters.patientId) params.append('patientId', filters.patientId);
      if (filters.status) params.append('status', filters.status);
      if (filters.examinationId) params.append('examinationId', filters.examinationId);
      
      const endpoint = Object.keys(filters).length > 0 
        ? `${endpoints.appointments.paged}?${params}`
        : endpoints.appointments.list;
        
      const response = await api.get(endpoint);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get appointment by ID
export function useAppointment(id) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(endpoints.appointments.byId(id));
      return response.data;
    },
    enabled: !!id,
  });
}

// Create appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointmentData) => {
      const response = await api.post(endpoints.appointments.create, appointmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Appointment created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create appointment');
    },
  });
}

// Update appointment
export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...appointmentData }) => {
      const response = await api.put(endpoints.appointments.update(id), appointmentData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      toast.success('Appointment updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update appointment');
    },
  });
}

// Delete appointment
export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(endpoints.appointments.delete(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Appointment deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete appointment');
    },
  });
}