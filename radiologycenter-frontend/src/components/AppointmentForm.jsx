import React, { useState, useEffect } from 'react';

const defaultValues = {
  patientId: '',
  unitId: '',
  examination: '',
  transferType: 'Cash',
  attachment: 'Undefined',
  treatingDoctor: '',
  technical: '',
  scheduledAt: '',
  status: 'Pending',
  notes: '',
  discount: 0,
  discountReason: '',
  medicalNotes: '',
  totalCost: 0,
  insuranceProviderId: '',
  contractId: '',
  examinationIds: [],
  appointmentDate: '',
};

const AppointmentForm = ({ initialValues, onSubmit, onCancel, loading, patients = [], units = [], examinations = [] }) => {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        patientId: initialValues.patientId || '',
        unitId: initialValues.unitId || '',
        examination: initialValues.examination || '',
        transferType: initialValues.transferType || 'Cash',
        attachment: initialValues.attachment || 'Undefined',
        treatingDoctor: initialValues.treatingDoctor || '',
        technical: initialValues.technical || '',
        scheduledAt: initialValues.scheduledAt ? new Date(initialValues.scheduledAt).toISOString().slice(0, 16) : '',
        status: initialValues.status || 'Pending',
        notes: initialValues.notes || '',
        discount: initialValues.discount || 0,
        discountReason: initialValues.discountReason || '',
        medicalNotes: initialValues.medicalNotes || '',
        totalCost: initialValues.totalCost || 0,
        insuranceProviderId: initialValues.insuranceProviderId || '',
        contractId: initialValues.contractId || '',
        examinationIds: initialValues.examinationIds || [],
        appointmentDate: initialValues.appointmentDate ? new Date(initialValues.appointmentDate).toISOString().slice(0, 16) : '',
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

  const handleExaminationChange = (e) => {
    const { value, checked } = e.target;
    const examId = parseInt(value);
    setValues((v) => ({
      ...v,
      examinationIds: checked 
        ? [...v.examinationIds, examId]
        : v.examinationIds.filter(id => id !== examId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...values,
      appointmentDate: values.appointmentDate || values.scheduledAt,
      scheduledAt: values.scheduledAt || values.appointmentDate,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Patient</label>
          <select
            name="patientId"
            className="select select-bordered"
            value={values.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.patientId || p.id} value={p.patientId || p.id}>
                {p.fullName || p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">Unit</label>
          <select
            name="unitId"
            className="select select-bordered"
            value={values.unitId}
            onChange={handleChange}
          >
            <option value="">Select Unit</option>
            {units.map((u) => (
              <option key={u.unitId || u.id} value={u.unitId || u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-control">
        <label className="label">Appointment Date & Time</label>
        <input
          name="appointmentDate"
          type="datetime-local"
          className="input input-bordered"
          value={values.appointmentDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Transfer Type</label>
          <select
            name="transferType"
            className="select select-bordered"
            value={values.transferType}
            onChange={handleChange}
          >
            <option value="Emergency">Emergency</option>
            <option value="Cash">Cash</option>
            <option value="Urgent">Urgent</option>
            <option value="Insurance">Insurance</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">Status</label>
          <select
            name="status"
            className="select select-bordered"
            value={values.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-control">
        <label className="label">Treating Doctor</label>
        <input
          name="treatingDoctor"
          className="input input-bordered"
          value={values.treatingDoctor}
          onChange={handleChange}
        />
      </div>

      <div className="form-control">
        <label className="label">Examinations</label>
        <div className="max-h-32 overflow-y-auto border rounded p-2">
          {examinations.map((exam) => (
            <label key={exam.examId || exam.id} className="flex items-center gap-2 p-1">
              <input
                type="checkbox"
                value={exam.examId || exam.id}
                checked={values.examinationIds.includes(exam.examId || exam.id)}
                onChange={handleExaminationChange}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">{exam.examNameEn || exam.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Discount</label>
          <input
            name="discount"
            type="number"
            step="0.01"
            className="input input-bordered"
            value={values.discount}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label className="label">Total Cost</label>
          <input
            name="totalCost"
            type="number"
            step="0.01"
            className="input input-bordered"
            value={values.totalCost}
            onChange={handleChange}
          />
        </div>
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

export default AppointmentForm;