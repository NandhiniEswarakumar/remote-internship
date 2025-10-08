import React, { useState, useEffect } from 'react';

const initialState = {
  candidateEmail: '',
  offerStatus: '',
  joiningDate: '',
  stipend: '',
  department: '',
  manager: '',
  notes: '',
  confirmationSent: false,
};

const statusOptions = ['Offered', 'Rejected', 'On Hold', 'Withdrawn'];

export default function OfferConfirmationForm() {
  const [form, setForm] = useState(initialState);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('offerConfirmationDraft');
    if (saved) {
      setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('offerConfirmationDraft', JSON.stringify(form));
  }, [form]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.removeItem('offerConfirmationDraft');
    alert('Offer confirmation submitted! (Demo)');
  }

  return (
    <div className="container">
      <h2 className="mb-3 text-center">Offer Confirmation Form</h2>
      {restored && <div className="mb-2" style={{color: '#fda085'}}>Draft restored from previous session.</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Candidate Email</label>
            <input name="candidateEmail" type="email" value={form.candidateEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Offer Status</label>
            <select name="offerStatus" value={form.offerStatus} onChange={handleChange} required>
              <option value="">Select</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Joining Date</label>
            <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Stipend</label>
            <input name="stipend" type="number" value={form.stipend} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Manager</label>
            <input name="manager" value={form.manager} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Special Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label>
              <input name="confirmationSent" type="checkbox" checked={form.confirmationSent} onChange={handleChange} />
              {' '}Confirmation Email Sent
            </label>
          </div>
        </div>
        <button className="btn w-100 mb-3" type="submit">Submit Confirmation</button>
      </form>
    </div>
  );
}
