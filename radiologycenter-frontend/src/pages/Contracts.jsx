import React, { useEffect, useState, useMemo } from 'react';
import contractService from '../services/contractService';
import Modal from '../components/Modal';
import ContractForm from '../components/ContractForm';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'delete'
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch contracts
  const fetchContracts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await contractService.getAll();
      setContracts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Search and pagination
  const filtered = useMemo(() => {
    return contracts.filter(
      c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [contracts, search]);

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
  const handleEdit = (contract) => {
    setSelected(contract);
    setModalType('edit');
    openModal();
  };
  const handleDelete = (contract) => {
    setSelected(contract);
    setModalType('delete');
    openModal();
  };

  // CRUD logic
  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (modalType === 'add') {
        const newContract = await contractService.create(values);
        setContracts((prev) => [newContract, ...prev]);
        showToast('Contract added successfully');
      } else if (modalType === 'edit') {
        const updated = await contractService.update(selected.id, values);
        setContracts((prev) => prev.map(c => (c.id === selected.id ? updated : c)));
        showToast('Contract updated successfully');
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
      await contractService.remove(selected.id);
      setContracts((prev) => prev.filter(c => c.id !== selected.id));
      showToast('Contract deleted successfully');
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
        <h2 className="text-2xl font-bold">Contracts</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search contracts..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add Contract</button>
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
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={5} className="text-center">No contracts found.</td></tr>
              ) : paginated.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.startDate}</td>
                  <td>{c.endDate}</td>
                  <td>{c.description}</td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(c)}>Delete</button>
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
        title={modalType === 'add' ? 'Add Contract' : 'Edit Contract'}
        actions={null}
      >
        <ContractForm
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
        title="Delete Contract"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={closeModal} disabled={formLoading}>Cancel</button>,
          <button key="delete" className="btn btn-error" onClick={handleDeleteConfirm} disabled={formLoading}>
            {formLoading ? <span className="loading loading-spinner"></span> : 'Delete'}
          </button>,
        ]}
      >
        <p>Are you sure you want to delete <b>{selected?.name}</b>?</p>
      </Modal>
    </div>
  );
};

export default Contracts; 