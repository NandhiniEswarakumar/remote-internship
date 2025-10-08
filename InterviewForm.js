import React, { useState, useEffect } from 'react';

const initialState = {
  candidateEmail: '',
  interviewDate: '',
  interviewTime: '',
  mode: '',
  interviewer: '',
  panel: '',
  location: '',
  notes: '',
  feedback: '',
  status: '',
};

const modeOptions = ['Online', 'Offline', 'Phone'];
const statusOptions = ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled'];

export default function InterviewForm() {
  const [form, setForm] = useState(initialState);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('interviewFormDraft');
    if (saved) {
      setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interviewFormDraft', JSON.stringify(form));
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.removeItem('interviewFormDraft');
    alert('Interview scheduled! (Demo)');
  }

  return (
    <div className="container">
      <h2 className="mb-3 text-center">Interview Scheduling Form</h2>
      {restored && <div className="mb-2" style={{color: '#fda085'}}>Draft restored from previous session.</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Candidate Email</label>
            <input name="candidateEmail" type="email" value={form.candidateEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Interview Date</label>
            <input name="interviewDate" type="date" value={form.interviewDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Interview Time</label>
            <input name="interviewTime" type="time" value={form.interviewTime} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mode</label>
            <select name="mode" value={form.mode} onChange={handleChange} required>
              <option value="">Select</option>
              {modeOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Interviewer</label>
            <input name="interviewer" value={form.interviewer} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Panel Members</label>
            <input name="panel" value={form.panel} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Location/Link</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value="">Select</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Feedback</label>
            <textarea name="feedback" value={form.feedback} onChange={handleChange} rows={2} />
          </div>
        </div>
        <button className="btn w-100 mb-3" type="submit">Schedule Interview</button>
      </form>
    </div>
  );
}
