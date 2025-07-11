import React, { useState, useEffect } from 'react';

const defaultValues = {
  patientId: '',
  contractId: '',
  startDate: '',
  endDate: '',
  notes: '',
};

const PatientContractForm = ({ initialValues, onSubmit, onCancel, loading, patients = [], contracts = [] }) => {
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
        <label className="label">Patient</label>
        <select
          name="patientId"
          className="select select-bordered"
          value={values.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label">Contract</label>
        <select
          name="contractId"
          className="select select-bordered"
          value={values.contractId}
          onChange={handleChange}
          required
        >
          <option value="">Select contract</option>
          {contracts.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
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
        <label className="label">Notes</label>
        <textarea
          name="notes"
          className="textarea textarea-bordered"
          value={values.notes}
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

export default PatientContractForm; 