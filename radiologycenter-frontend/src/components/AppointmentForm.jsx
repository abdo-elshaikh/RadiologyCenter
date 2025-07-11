import React, { useState, useEffect } from 'react';

const defaultValues = {
  patientId: '',
  date: '',
  status: '',
};

const AppointmentForm = ({ initialValues, onSubmit, onCancel, loading }) => {
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
        <label className="label">Patient ID</label>
        <input
          name="patientId"
          className="input input-bordered"
          value={values.patientId}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Date</label>
        <input
          name="date"
          type="datetime-local"
          className="input input-bordered"
          value={values.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Status</label>
        <input
          name="status"
          className="input input-bordered"
          value={values.status}
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

export default AppointmentForm; 