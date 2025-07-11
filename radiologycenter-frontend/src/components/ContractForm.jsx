import React, { useState, useEffect } from 'react';

const defaultValues = {
  name: '',
  startDate: '',
  endDate: '',
  description: '',
};

const ContractForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    setValues(initialValues || defaultValues);
  }, [initialValues]);

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">Name</label>
        <input
          name="name"
          className="input input-bordered"
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Start Date</label>
        <input
          name="startDate"
          type="date"
          className="input input-bordered"
          value={values.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">End Date</label>
        <input
          name="endDate"
          type="date"
          className="input input-bordered"
          value={values.endDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          name="description"
          className="textarea textarea-bordered"
          value={values.description}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ContractForm; 