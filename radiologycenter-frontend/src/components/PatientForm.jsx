import React, { useState, useEffect } from 'react';
import Input from './common/Input';

const defaultValues = {
  name: '',
  phone: '',
  birthDate: '',
  gender: '',
  address: '',
  notes: '',
};

const PatientForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.fullName || initialValues.name || '',
        phone: initialValues.phone || '',
        birthDate: initialValues.birthDate ? initialValues.birthDate.split('T')[0] : '',
        gender: initialValues.gender || '',
        address: initialValues.address || '',
        notes: initialValues.notes || '',
      });
    } else {
      setValues(defaultValues);
    }
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
        <label className="label">Full Name</label>
        <Input
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Phone</label>
        <Input
          name="phone"
          value={values.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Birth Date</label>
        <Input
          name="birthDate"
          type="date"
          value={values.birthDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Gender</label>
        <select
          name="gender"
          className="select select-bordered"
          value={values.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label">Address</label>
        <Input
          name="address"
          value={values.address}
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

export default PatientForm;