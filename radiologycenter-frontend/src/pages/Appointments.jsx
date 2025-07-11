import React, { useEffect, useState, useMemo } from 'react';
import appointmentService from '../services/appointmentService';
import patientService from '../services/patientService';
import unitService from '../services/unitService';
import Modal from '../components/Modal';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentFilters from '../components/AppointmentFilters';
import useModal from '../hooks/useModal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ['Scheduled', 'Completed', 'Cancelled'];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'delete'
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ from: '', to: '', patientId: '', unitId: '', status: '' });
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [units, setUnits] = useState([]);
  const { open, openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // Fetch appointments, patients, units
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, patientsData, unitsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        unitService.getAll(),
      ]);
      setAppointments(data);
      setPatients(patientsData);
      setUnits(unitsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Advanced filtering
  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchesSearch =
        (patients.find(p => p.id === a.patientId)?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (units.find(u => u.id === a.unitId)?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.status || '').toLowerCase().includes(search.toLowerCase());
      const matchesFrom = !filters.from || a.date >= filters.from;
      const matchesTo = !filters.to || a.date <= filters.to;
      const matchesPatient = !filters.patientId || a.patientId === filters.patientId;
      const matchesUnit = !filters.unitId || a.unitId === filters.unitId;
      const matchesStatus = !filters.status || a.status === filters.status;
      return matchesSearch && matchesFrom && matchesTo && matchesPatient && matchesUnit && matchesStatus;
    });
  }, [appointments, search, filters, patients, units]);

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
  const handleEdit = (appointment) => {
    setSelected(appointment);
    setModalType('edit');
    openModal();
  };
  const handleDelete = (appointment) => {
    setSelected(appointment);
    setModalType('delete');
    openModal();
  };

  // CRUD logic
  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (modalType === 'add') {
        const newAppointment = await appointmentService.create(values);
        setAppointments((prev) => [newAppointment, ...prev]);
        showToast('Appointment added successfully');
      } else if (modalType === 'edit') {
        const updated = await appointmentService.update(selected.id, values);
        setAppointments((prev) => prev.map(a => (a.id === selected.id ? updated : a)));
        showToast('Appointment updated successfully');
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
      await appointmentService.remove(selected.id);
      setAppointments((prev) => prev.filter(a => a.id !== selected.id));
      showToast('Appointment deleted successfully');
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search appointments..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn btn-primary" onClick={() => { setSelected(null); setModalType('add'); openModal(); }}>Add Appointment</button>
        </div>
      </div>
      <AppointmentFilters
        filters={filters}
        onChange={f => { setFilters(f); setPage(1); }}
        patients={patients}
        units={units}
        statusOptions={STATUS_OPTIONS}
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
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={4} className="text-center">No appointments found.</td></tr>
              ) : paginated.map((a) => (
                <tr key={a.id}>
                  <td>{a.patientName || a.patientId}</td>
                  <td>{a.date}</td>
                  <td>{a.status}</td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2" onClick={() => handleEdit(a)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(a)}>Delete</button>
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
        title={modalType === 'add' ? 'Add Appointment' : 'Edit Appointment'}
        actions={null}
      >
        <AppointmentForm
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
        title="Delete Appointment"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={closeModal} disabled={formLoading}>Cancel</button>,
          <button key="delete" className="btn btn-error" onClick={handleDeleteConfirm} disabled={formLoading}>
            {formLoading ? <span className="loading loading-spinner"></span> : 'Delete'}
          </button>,
        ]}
      >
        <p>Are you sure you want to delete this appointment?</p>
      </Modal>
    </div>
  );
};

export default Appointments; 