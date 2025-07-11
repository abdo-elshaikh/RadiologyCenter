import React, { useEffect, useState, useMemo } from 'react';
import insuranceProviderService from '../services/insuranceProviderService';
import Modal from '../components/Modal';
import InsuranceProviderForm from '../components/InsuranceProviderForm';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;

const InsuranceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'delete'
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch providers
  const fetchProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await insuranceProviderService.getAll();
      setProviders(data);
    } catch (err) {
      setError(err.message || 'Failed to load insurance providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Search and pagination
  const filtered = useMemo(() => {
    return providers.filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.contactPerson || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.contactEmail || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [providers, search]);

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
  const handleEdit = (provider) => {
    setSelected(provider);
    setModalType('edit');
    openModal();
  };
  const handleDelete = (provider) => {
    setSelected(provider);
    setModalType('delete');
    openModal();
  };

  // CRUD logic
  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (modalType === 'add') {
        const newProvider = await insuranceProviderService.create(values);
        setProviders((prev) => [newProvider, ...prev]);
        showToast('Provider added successfully');
      } else if (modalType === 'edit') {
        const updated = await insuranceProviderService.update(selected.id, values);
        setProviders((prev) => prev.map(p => (p.id === selected.id ? updated : p)));
        showToast('Provider updated successfully');
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
      await insuranceProviderService.remove(selected.id);
      setProviders((prev) => prev.filter(p => p.id !== selected.id));
      showToast('Provider deleted successfully');
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
        <h2 className="text-2xl font-bold">Insurance Providers</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search providers..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add Provider</button>
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
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={4} className="text-center">No providers found.</td></tr>
              ) : paginated.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.contactPerson}</td>
                  <td>{p.contactEmail}</td>
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
        title={modalType === 'add' ? 'Add Provider' : 'Edit Provider'}
        actions={null}
      >
        <InsuranceProviderForm
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
        title="Delete Provider"
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

export default InsuranceProviders; 