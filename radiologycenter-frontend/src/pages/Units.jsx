import React, { useEffect, useState, useMemo } from 'react';
import unitService from '../services/unitService';
import Modal from '../components/common/Modal';
import UnitForm from '../components/UnitForm';
import UnitFilters from '../components/UnitFilters';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'delete'
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ name: '', type: '' });
  const [page, setPage] = useState(1);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch units
  const fetchUnits = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await unitService.getAll();
      setUnits(data);
    } catch (err) {
      setError(err.message || 'Failed to load units');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // Advanced filtering
  const filtered = useMemo(() => {
    return units.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase());
      const matchesName = !filters.name || u.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesType = !filters.type || u.type.toLowerCase().includes(filters.type.toLowerCase());
      return matchesSearch && matchesName && matchesType;
    });
  }, [units, search, filters]);

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
  const handleEdit = (unit) => {
    setSelected(unit);
    setModalType('edit');
    openModal();
  };
  const handleDelete = (unit) => {
    setSelected(unit);
    setModalType('delete');
    openModal();
  };

  // CRUD logic
  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (modalType === 'add') {
        const newUnit = await unitService.create(values);
        setUnits((prev) => [newUnit, ...prev]);
        showToast('Unit added successfully');
      } else if (modalType === 'edit') {
        const updated = await unitService.update(selected.id, values);
        setUnits((prev) => prev.map(u => (u.id === selected.id ? updated : u)));
        showToast('Unit updated successfully');
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
      await unitService.remove(selected.id);
      setUnits((prev) => prev.filter(u => u.id !== selected.id));
      showToast('Unit deleted successfully');
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
        <h2 className="text-2xl font-bold">Units</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search units..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add Unit</button>
        </div>
      </div>
      <UnitFilters
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
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={3} className="text-center">No units found.</td></tr>
              ) : paginated.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.location}</td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2" onClick={() => handleEdit(u)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(u)}>Delete</button>
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
        title={modalType === 'add' ? 'Add Unit' : 'Edit Unit'}
        actions={null}
      >
        <UnitForm
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
        title="Delete Unit"
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

export default Units; 