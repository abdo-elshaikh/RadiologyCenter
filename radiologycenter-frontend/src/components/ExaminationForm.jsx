import React, { useState, useEffect } from 'react';

const defaultValues = {
  examNameEn: '',
  examNameAr: '',
  basePrice: 0,
  unitId: '',
};

const ExaminationForm = ({ initialValues, onSubmit, onCancel, loading, units = [] }) => {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        examNameEn: initialValues.examNameEn || initialValues.name || '',
        examNameAr: initialValues.examNameAr || '',
        basePrice: initialValues.basePrice || 0,
        unitId: initialValues.unitId || '',
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
        <label className="label">Examination Name (English)</label>
        <input
          name="examNameEn"
          className="input input-bordered"
          value={values.examNameEn}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Examination Name (Arabic)</label>
        <input
          name="examNameAr"
          className="input input-bordered"
          value={values.examNameAr}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Base Price</label>
        <input
          name="basePrice"
          type="number"
          step="0.01"
          className="input input-bordered"
          value={values.basePrice}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-control">
        <label className="label">Unit</label>
        <select
          name="unitId"
          className="select select-bordered"
          value={values.unitId}
          onChange={handleChange}
          required
        >
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u.unitId || u.id} value={u.unitId || u.id}>
              {u.name}
            </option>
          ))}
        </select>
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

export default ExaminationForm;