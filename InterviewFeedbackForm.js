import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const initialState = {
  candidateEmail: '',
  interviewer: '',
  interviewDate: '',
  communication: '',
  technical: '',
  problemSolving: '',
  attitude: '',
  overall: '',
  strengths: '',
  weaknesses: '',
  recommendation: '',
  comments: '',
};

const ratingOptions = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];
const recommendationOptions = ['Strongly Recommend', 'Recommend', 'Neutral', 'Do Not Recommend'];

export default function InterviewFeedbackForm() {
  const [form, setForm] = useState(initialState);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('interviewFeedbackDraft');
    if (saved) {
      setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interviewFeedbackDraft', JSON.stringify(form));
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Try to save to Firestore first
    (async () => {
      try {
        if (db) {
          await addDoc(collection(db, 'feedbacks'), { ...form, createdAt: serverTimestamp() });
          localStorage.removeItem('interviewFeedbackDraft');
          alert('Feedback submitted and saved to Firestore!');
          setForm(initialState);
          return;
        }
      } catch (err) {
        console.error('Firestore save failed', err);
      }

      // Fallback: save submitted feedback into localStorage array
      const existing = JSON.parse(localStorage.getItem('interviewFeedbacks') || '[]');
      existing.push({ ...form, submittedAt: new Date().toISOString() });
      localStorage.setItem('interviewFeedbacks', JSON.stringify(existing));
      localStorage.removeItem('interviewFeedbackDraft');
      alert('Feedback submitted (saved locally).');
      setForm(initialState);
    })();
  }

  return (
    <div className="container">
      <h2 className="mb-3 text-center">Interview Feedback Form</h2>
      {restored && <div className="mb-2" style={{color: '#fda085'}}>Draft restored from previous session.</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Candidate Email</label>
            <input name="candidateEmail" type="email" value={form.candidateEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Interviewer</label>
            <input name="interviewer" value={form.interviewer} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Interview Date</label>
            <input name="interviewDate" type="date" value={form.interviewDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Communication Skills</label>
            <select name="communication" value={form.communication} onChange={handleChange} required>
              <option value="">Select</option>
              {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Technical Skills</label>
            <select name="technical" value={form.technical} onChange={handleChange} required>
              <option value="">Select</option>
              {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Problem Solving</label>
            <select name="problemSolving" value={form.problemSolving} onChange={handleChange} required>
              <option value="">Select</option>
              {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Attitude</label>
            <select name="attitude" value={form.attitude} onChange={handleChange} required>
              <option value="">Select</option>
              {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Overall Rating</label>
            <select name="overall" value={form.overall} onChange={handleChange} required>
              <option value="">Select</option>
              {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Strengths</label>
            <textarea name="strengths" value={form.strengths} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label>Weaknesses</label>
            <textarea name="weaknesses" value={form.weaknesses} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label>Recommendation</label>
            <select name="recommendation" value={form.recommendation} onChange={handleChange} required>
              <option value="">Select</option>
              {recommendationOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Additional Comments</label>
            <textarea name="comments" value={form.comments} onChange={handleChange} rows={2} />
          </div>
        </div>
        <button className="btn w-100 mb-3" type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}
