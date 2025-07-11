import React from 'react';

const AppointmentFilters = ({ filters, onChange, patients = [], units = [], statusOptions = [] }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="date"
        name="from"
        className="input input-bordered"
        value={filters.from || ''}
        onChange={handleChange}
        placeholder="From"
      />
      <input
        type="date"
        name="to"
        className="input input-bordered"
        value={filters.to || ''}
        onChange={handleChange}
        placeholder="To"
      />
      <select
        name="patientId"
        className="select select-bordered"
        value={filters.patientId || ''}
        onChange={handleChange}
      >
        <option value="">All Patients</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select
        name="unitId"
        className="select select-bordered"
        value={filters.unitId || ''}
        onChange={handleChange}
      >
        <option value="">All Units</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <select
        name="status"
        className="select select-bordered"
        value={filters.status || ''}
        onChange={handleChange}
      >
        <option value="">All Statuses</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
};

export default AppointmentFilters; 