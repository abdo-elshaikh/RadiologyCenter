import React, { useEffect, useState, useMemo } from 'react';
import patientService from '../services/patientService';
import Modal from '../components/common/Modal';
import PatientForm from '../components/PatientForm';
import PatientFilters from '../components/PatientFilters';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';
import ExportButton from '../components/ExportButton';

const PAGE_SIZE = 10;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'delete'
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ name: '', dob: '', gender: '' });
  const [page, setPage] = useState(1);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch patients
  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await patientService.getAll();
      setPatients(data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to load patients');
      showToast('Failed to load patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Advanced filtering with error handling
  const filtered = useMemo(() => {
    try {
      return patients.filter((p) => {
        if (!p) return false;
        
        const matchesSearch =
          (p.firstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (p.lastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (p.email?.toLowerCase() || '').includes(search.toLowerCase());
        const matchesName = !filters.name || 
          (p.firstName?.toLowerCase() || '').includes(filters.name.toLowerCase()) || 
          (p.lastName?.toLowerCase() || '').includes(filters.name.toLowerCase());
        const matchesDob = !filters.dob || p.dateOfBirth === filters.dob;
        const matchesGender = !filters.gender || p.gender === filters.gender;
        return matchesSearch && matchesName && matchesDob && matchesGender;
      });
    } catch (err) {
      console.error('Error filtering patients:', err);
      return [];
    }
  }, [patients, search, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    try {
      const start = (page - 1) * PAGE_SIZE;
      return filtered.slice(start, start + PAGE_SIZE);
    } catch (err) {
      console.error('Error paginating patients:', err);
      return [];
    }
  }, [filtered, page]);

  // Modal handlers
  const handleAdd = () => {
    setSelected(null);
    setModalType('add');
    openModal();
  };
  const handleEdit = (patient) => {
    setSelected(patient);
    setModalType('edit');
    openModal();
  };
  const handleDelete = (patient) => {
    setSelected(patient);
    setModalType('delete');
    openModal();
  };

  // CRUD logic
  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (modalType === 'add') {
        const newPatient = await patientService.create(values);
        setPatients((prev) => [newPatient, ...prev]);
        showToast('Patient added successfully');
      } else if (modalType === 'edit') {
        const updated = await patientService.update(selected.id, values);
        setPatients((prev) => prev.map(p => (p.id === selected.id ? updated : p)));
        showToast('Patient updated successfully');
      }
      closeModal();
    } catch (err) {
      console.error('Error in form submission:', err);
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      await patientService.remove(selected.id);
      setPatients((prev) => prev.filter(p => p.id !== selected.id));
      showToast('Patient deleted successfully');
      closeModal();
    } catch (err) {
      console.error('Error deleting patient:', err);
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Patients</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search patients..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <ExportButton 
            data={filtered} 
            filename="patients.csv"
            columns={['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'gender']}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add Patient</button>
        </div>
      </div>
      <PatientFilters
        filters={filters}
        onChange={f => { setFilters(f); setPage(1); }}
      />
      {loading ? (
        <div className="flex justify-center"><span className="loading loading-spinner"></span></div>
      ) : error ? (
        <div className="alert alert-error">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={4} className="text-center">No patients found.</td></tr>
              ) : paginated.map((p) => (
                <tr key={p.id}>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{p.email}</td>
                  <td>{p.phoneNumber}</td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handlePageChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      )}
      {/* Add/Edit Modal */}
      <Modal
        open={open && (modalType === 'add' || modalType === 'edit')}
        onClose={closeModal}
        title={modalType === 'add' ? 'Add Patient' : 'Edit Patient'}
        actions={null}
      >
        <PatientForm
          initialValues={modalType === 'edit' ? selected : null}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
      {/* Delete Modal */}
      <Modal
        open={open && modalType === 'delete'}
        onClose={closeModal}
        title="Delete Patient"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={closeModal} disabled={formLoading}>Cancel</button>,
          <button key="delete" className="btn btn-error" onClick={handleDeleteConfirm} disabled={formLoading}>
            {formLoading ? <span className="loading loading-spinner"></span> : 'Delete'}
          </button>,
        ]}
      >
        <p>Are you sure you want to delete <b>{selected?.firstName} {selected?.lastName}</b>?</p>
      </Modal>
    </div>
  );
};

export default Patients; 