import React from 'react';

const UnitFilters = ({ filters, onChange }) => {
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
        type="text"
        name="type"
        className="input input-bordered"
        value={filters.type || ''}
        onChange={handleChange}
        placeholder="Type"
      />
    </div>
  );
};

export default UnitFilters; 