import React from 'react';

const PatientFilters = ({ filters, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        name="name"
        className="input input-bordered"
        value={filters.name || ''}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="date"
        name="dob"
        className="input input-bordered"
        value={filters.dob || ''}
        onChange={handleChange}
        placeholder="Date of Birth"
      />
      <select
        name="gender"
        className="select select-bordered"
        value={filters.gender || ''}
        onChange={handleChange}
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

export default PatientFilters; 