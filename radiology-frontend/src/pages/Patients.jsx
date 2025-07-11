import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../hooks/api/usePatients';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Menu } from '@headlessui/react';
import { formatDate, debounce } from '../lib/utils';

const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export default function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const { data: patients, isLoading } = usePatients(filters);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
  });

  const debouncedSearch = debounce((term) => {
    setFilters(prev => ({ ...prev, name: term }));
  }, 300);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const openModal = (patient = null) => {
    setEditingPatient(patient);
    if (patient) {
      reset({
        name: patient.fullName || patient.name,
        phone: patient.phone,
        birthDate: patient.birthDate?.split('T')[0] || patient.dateOfBirth?.split('T')[0],
        gender: patient.gender,
        address: patient.address,
        notes: patient.notes,
      });
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingPatient) {
      updatePatient.mutate(
        { id: editingPatient.patientId || editingPatient.id, ...data },
        { onSuccess: closeModal }
      );
    } else {
      createPatient.mutate(data, { onSuccess: closeModal });
    }
  };

  const handleDelete = (patient) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient.mutate(patient.patientId || patient.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage patient records and information
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearch}
            className="input pl-10 w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Patients Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Birth Date</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients?.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.patientId || patient.id}>
                    <td className="font-medium">
                      {patient.fullName || patient.name}
                    </td>
                    <td>{patient.phone}</td>
                    <td>{formatDate(patient.birthDate || patient.dateOfBirth)}</td>
                    <td>{patient.gender}</td>
                    <td className="max-w-xs truncate">{patient.address}</td>
                    <td>
                      <Menu as="div" className="relative">
                        <Menu.Button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none z-10">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => openModal(patient)}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                              >
                                <Edit className="mr-3 h-4 w-4" />
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleDelete(patient)}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } flex items-center w-full px-4 py-2 text-sm text-red-700`}
                              >
                                <Trash2 className="mr-3 h-4 w-4" />
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('name')}
              label="Full Name"
              required
              error={errors.name?.message}
            />
            <Input
              {...register('phone')}
              label="Phone Number"
              required
              error={errors.phone?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('birthDate')}
              label="Birth Date"
              type="date"
              required
              error={errors.birthDate?.message}
            />
            <Select
              {...register('gender')}
              label="Gender"
              required
              error={errors.gender?.message}
              placeholder="Select gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <Input
            {...register('address')}
            label="Address"
            error={errors.address?.message}
          />

          <Textarea
            {...register('notes')}
            label="Notes"
            rows={3}
            error={errors.notes?.message}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createPatient.isPending || updatePatient.isPending}
            >
              {editingPatient ? 'Update' : 'Create'} Patient
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}