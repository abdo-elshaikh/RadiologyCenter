import React, { useEffect, useState, useMemo } from 'react';
import examinationService from '../services/examinationService';
import Modal from '../components/Modal';
import ExaminationForm from '../components/ExaminationForm';
import ExaminationFilters from '../components/ExaminationFilters';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;

const Examinations = () => {
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ name: '', type: '' });
  const [page, setPage] = useState(1);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch examinations
  const fetchExaminations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await examinationService.getAll();
      setExaminations(data);
    } catch (err) {
      setError(err.message || 'Failed to load examinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExaminations();
  }, []);

  // Advanced filtering
  const filtered = useMemo(() => {
    return examinations.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase());
      const matchesName = !filters.name || e.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesType = !filters.type || e.type.toLowerCase().includes(filters.type.toLowerCase());
      return matchesSearch && matchesName && matchesType;
    });
  }, [examinations, search, filters]);

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
  const handleEdit = (examination) => {
    setSelected(examination);
    setModalType('edit');
    openModal();
  };
  const handleDelete = (examination) => {
    setSelected(examination);
    setModalType('delete');
    openModal();
  };

  // CRUD logic
  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (modalType === 'add') {
        const newExamination = await examinationService.create(values);
        setExaminations((prev) => [newExamination, ...prev]);
        showToast('Examination added successfully');
      } else if (modalType === 'edit') {
        const updated = await examinationService.update(selected.id, values);
        setExaminations((prev) => prev.map(e => (e.id === selected.id ? updated : e)));
        showToast('Examination updated successfully');
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
      await examinationService.remove(selected.id);
      setExaminations((prev) => prev.filter(e => e.id !== selected.id));
      showToast('Examination deleted successfully');
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
        <h2 className="text-2xl font-bold">Examinations</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search examinations..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add Examination</button>
        </div>
      </div>
      <ExaminationFilters
        filters={filters}
        onChange={f => { setFilters(f); setPage(1); }}
      />
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
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={3} className="text-center">No examinations found.</td></tr>
              ) : paginated.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.type}</td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2" onClick={() => handleEdit(e)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(e)}>Delete</button>
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
        title={modalType === 'add' ? 'Add Examination' : 'Edit Examination'}
        actions={null}
      >
        <ExaminationForm
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
        title="Delete Examination"
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

export default Examinations; 