import React, { useEffect, useState, useMemo } from 'react';
import patientContractService from '../services/patientContractService';
import patientService from '../services/patientService';
import contractService from '../services/contractService';
import Modal from '../components/Modal';
import PatientContractForm from '../components/PatientContractForm';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;

const PatientContract = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'delete'
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [contracts, setContracts] = useState([]);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch patient contracts, patients, and contracts
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, patientsData, contractsData] = await Promise.all([
        patientContractService.getAll(),
        patientService.getAll(),
        contractService.getAll(),
      ]);
      setItems(data);
      setPatients(patientsData);
      setContracts(contractsData);
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
        (contracts.find(c => c.id === i.contractId)?.name || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, patients, contracts]);

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
        const newItem = await patientContractService.create(values);
        setItems((prev) => [newItem, ...prev]);
        showToast('Patient contract added successfully');
      } else if (modalType === 'edit') {
        const updated = await patientContractService.update(selected.id, values);
        setItems((prev) => prev.map(i => (i.id === selected.id ? updated : i)));
        showToast('Patient contract updated successfully');
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
      await patientContractService.remove(selected.id);
      setItems((prev) => prev.filter(i => i.id !== selected.id));
      showToast('Patient contract deleted successfully');
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
        <h2 className="text-2xl font-bold">Patient Contracts</h2>
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
                <th>Contract</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center">No records found.</td></tr>
              ) : paginated.map((i) => (
                <tr key={i.id}>
                  <td>{patients.find(p => p.id === i.patientId)?.name || '-'}</td>
                  <td>{contracts.find(c => c.id === i.contractId)?.name || '-'}</td>
                  <td>{i.startDate}</td>
                  <td>{i.endDate}</td>
                  <td>{i.notes}</td>
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
        title={modalType === 'add' ? 'Add Patient Contract' : 'Edit Patient Contract'}
        actions={null}
      >
        <PatientContractForm
          initialValues={modalType === 'edit' ? selected : null}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={formLoading}
          patients={patients}
          contracts={contracts}
        />
      </Modal>
      {/* Delete Modal */}
      <Modal
        open={open && modalType === 'delete'}
        onClose={closeModal}
        title="Delete Patient Contract"
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

export default PatientContract; 