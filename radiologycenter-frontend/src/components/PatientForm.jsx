import React, { useState, useEffect } from 'react';
import Input from './common/Input';

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

const PatientForm = ({ initialValues, onSubmit, onCancel, loading }) => {
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
        <label className="label">First Name</label>
        <Input
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Last Name</label>
        <Input
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Email</label>
        <Input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Phone Number</label>
        <Input
          name="phoneNumber"
          value={values.phoneNumber}
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

export default PatientForm; 