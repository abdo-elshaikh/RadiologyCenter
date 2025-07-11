import React, { useState, useEffect } from 'react';

const defaultValues = {
  patientId: '',
  insuranceProviderId: '',
  policyNumber: '',
  validFrom: '',
  validTo: '',
};

const PatientInsuranceForm = ({ initialValues, onSubmit, onCancel, loading, patients = [], insuranceProviders = [] }) => {
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
        <label className="label">Insurance Provider</label>
        <select
          name="insuranceProviderId"
          className="select select-bordered"
          value={values.insuranceProviderId}
          onChange={handleChange}
          required
        >
          <option value="">Select provider</option>
          {insuranceProviders.map((ip) => (
            <option key={ip.id} value={ip.id}>{ip.name}</option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label">Policy Number</label>
        <input
          name="policyNumber"
          className="input input-bordered"
          value={values.policyNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Valid From</label>
        <input
          name="validFrom"
          type="date"
          className="input input-bordered"
          value={values.validFrom}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Valid To</label>
        <input
          name="validTo"
          type="date"
          className="input input-bordered"
          value={values.validTo}
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

export default PatientInsuranceForm; 