import React, { useEffect, useState, useMemo } from 'react';
import patientInsuranceService from '../services/patientInsuranceService';
import patientService from '../services/patientService';
import insuranceProviderService from '../services/insuranceProviderService';
import Modal from '../components/Modal';
import PatientInsuranceForm from '../components/PatientInsuranceForm';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;

const PatientInsurance = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'delete'
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch patient insurance, patients, and providers
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, patientsData, providersData] = await Promise.all([
        patientInsuranceService.getAll(),
        patientService.getAll(),
        insuranceProviderService.getAll(),
      ]);
      setItems(data);
      setPatients(patientsData);
      setInsuranceProviders(providersData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Search and pagination
  const filtered = useMemo(() => {
    return items.filter(
      i =>
        (patients.find(p => p.id === i.patientId)?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (insuranceProviders.find(ip => ip.id === i.insuranceProviderId)?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (i.policyNumber || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, patients, insuranceProviders]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Modal handlers
  const handleAdd = () => {
    setSelected(null);
    setModalType('add');
    openModal();
  };
  const handleEdit = (item) => {
    setSelected(item);
    setModalType('edit');
    openModal();
  };
  const handleDelete = (item) => {
    setSelected(item);
    setModalType('delete');
    openModal();
  };

  // CRUD logic
  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (modalType === 'add') {
        const newItem = await patientInsuranceService.create(values);
        setItems((prev) => [newItem, ...prev]);
        showToast('Patient insurance added successfully');
      } else if (modalType === 'edit') {
        const updated = await patientInsuranceService.update(selected.id, values);
        setItems((prev) => prev.map(i => (i.id === selected.id ? updated : i)));
        showToast('Patient insurance updated successfully');
      }
      closeModal();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      await patientInsuranceService.remove(selected.id);
      setItems((prev) => prev.filter(i => i.id !== selected.id));
      showToast('Patient insurance deleted successfully');
      closeModal();
    } catch (err) {
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
        <h2 className="text-2xl font-bold">Patient Insurance</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center"><span className="loading loading-spinner"></span></div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Provider</th>
                <th>Policy #</th>
                <th>Valid From</th>
                <th>Valid To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center">No records found.</td></tr>
              ) : paginated.map((i) => (
                <tr key={i.id}>
                  <td>{patients.find(p => p.id === i.patientId)?.name || '-'}</td>
                  <td>{insuranceProviders.find(ip => ip.id === i.insuranceProviderId)?.name || '-'}</td>
                  <td>{i.policyNumber}</td>
                  <td>{i.validFrom}</td>
                  <td>{i.validTo}</td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2" onClick={() => handleEdit(i)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(i)}>Delete</button>
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
        title={modalType === 'add' ? 'Add Patient Insurance' : 'Edit Patient Insurance'}
        actions={null}
      >
        <PatientInsuranceForm
          initialValues={modalType === 'edit' ? selected : null}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={formLoading}
          patients={patients}
          insuranceProviders={insuranceProviders}
        />
      </Modal>
      {/* Delete Modal */}
      <Modal
        open={open && modalType === 'delete'}
        onClose={closeModal}
        title="Delete Patient Insurance"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={closeModal} disabled={formLoading}>Cancel</button>,
          <button key="delete" className="btn btn-error" onClick={handleDeleteConfirm} disabled={formLoading}>
            {formLoading ? <span className="loading loading-spinner"></span> : 'Delete'}
          </button>,
        ]}
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>
    </div>
  );
};

export default PatientInsurance; 