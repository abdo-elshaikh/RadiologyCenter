import React, { useState, useEffect } from 'react';

const defaultValues = {
  name: '',
  contactInfo: '',
  policyDetails: '',
  coveragePercent: 0,
  discountAmount: 0,
};

const InsuranceProviderForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name || '',
        contactInfo: initialValues.contactInfo || initialValues.contactPerson || '',
        policyDetails: initialValues.policyDetails || '',
        coveragePercent: initialValues.coveragePercent || 0,
        discountAmount: initialValues.discountAmount || 0,
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues((v) => ({ 
      ...v, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
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
        <label className="label">Contact Info</label>
        <input
          name="contactInfo"
          className="input input-bordered"
          value={values.contactInfo}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">Policy Details</label>
        <textarea
          name="policyDetails"
          className="textarea textarea-bordered"
          value={values.policyDetails}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Coverage Percent</label>
          <input
            name="coveragePercent"
            type="number"
            step="0.01"
            className="input input-bordered"
            value={values.coveragePercent}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label className="label">Discount Amount</label>
          <input
            name="discountAmount"
            type="number"
            step="0.01"
            className="input input-bordered"
            value={values.discountAmount}
            onChange={handleChange}
          />
        </div>
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

export default InsuranceProviderForm;