import React, { useState, useEffect, useRef } from 'react';
import FormField from '../components/FormField';

const initialState = {
  // Personal Info
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  // Education
  educationLevel: '',
  university: '',
  graduationYear: '',
  gpa: '',
  // Internship Details
  position: '',
  department: '',
  startDate: '',
  endDate: '',
  remote: false,
  preferredLocation: '',
  // Skills & Experience
  skills: [],
  experienceYears: '',
  portfolio: '',
  resume: null,
  // Preferences
  workHours: '',
  expectedStipend: '',
  availableFrom: '',
  // Other
  reference: '',
  agreeTerms: false,
  coverLetter: '',
  feedback: '',
  contactMethod: 'Email',
};


const skillOptions = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'UI/UX', 'Communication', 'Teamwork'];
const educationOptions = ['High School', 'Diploma', 'Bachelor', 'Master', 'PhD'];
const genderOptions = ['Male', 'Female', 'Other'];
const departmentOptions = ['Engineering', 'Marketing', 'HR', 'Finance', 'Design'];



export default function ApplicationForm() {
  // Try to prefill with user profile if available
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('applicationFormDraft');
    if (saved) return { ...initialState, ...JSON.parse(saved) };
    // Try to get logged-in user's profile
    const currentUserEmail = JSON.parse(localStorage.getItem('firebase:authUser:') || 'null')?.email;
    let profile = null;
    if (currentUserEmail) {
      profile = JSON.parse(localStorage.getItem('userProfile_' + currentUserEmail) || 'null');
    }
    return {
      ...initialState,
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
    };
  });
  const [resumeName, setResumeName] = useState('');
  const [restored, setRestored] = useState(false);
  const firstNameRef = useRef();
  const [phoneError, setPhoneError] = useState('');

  // Restore draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('applicationFormDraft');
    if (saved) {
      setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
      setRestored(true);
    }
    // focus first field for better UX
    setTimeout(() => firstNameRef.current?.focus(), 150);
  }, []);

  // Auto-save to localStorage on form change (except file)
  useEffect(() => {
    const { resume, ...toSave } = form;
    localStorage.setItem('applicationFormDraft', JSON.stringify(toSave));
  }, [form]);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setForm(prev => ({ ...prev, [name]: files[0] }));
      setResumeName(files[0]?.name || '');
    } else if (type === 'select-multiple') {
      const selected = Array.from(e.target.selectedOptions, option => option.value);
      setForm(prev => ({ ...prev, [name]: selected }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleContactMethodChange(e) {
    setForm(prev => ({ ...prev, contactMethod: e.target.value }));
  }

  function validatePhone(value) {
    if (!value) {
      setPhoneError('');
      return true;
    }
    const re = /^\+?[0-9]{7,15}$/;
    const ok = re.test(value.trim());
    setPhoneError(ok ? '' : 'Enter a valid phone number (digits only, 7-15 chars)');
    return ok;
  }

  function handlePhoneBlur(e) {
    validatePhone(e.target.value);
  }

  function computeDuration(start, end) {
    if (!start || !end) return '';
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e) || e < s) return '';
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return diff + ' days';
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Save application to localStorage array
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push({ ...form, submittedAt: new Date().toISOString() });
    localStorage.setItem('applications', JSON.stringify(applications));
    localStorage.removeItem('applicationFormDraft');
    alert('Application submitted!');
    setForm(initialState);
  }

  return (
    <div className="narrow">
      <h2 className="mb-3 text-center">Internship Application Form</h2>
      {restored && <div className="mb-2" style={{color: '#fda085'}}>Draft restored from previous session.</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Personal Info */}
          <FormField label="First Name">
            <input name="firstName" ref={firstNameRef} value={form.firstName} onChange={handleChange} required />
          </FormField>
          <FormField label="Last Name">
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </FormField>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} onBlur={handlePhoneBlur} />
            {phoneError && <div className="field-error">{phoneError}</div>}
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input name="dob" type="date" value={form.dob} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Zip</label>
            <input name="zip" value={form.zip} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input name="country" value={form.country} onChange={handleChange} required />
          </div>

          {/* Education */}
          <div className="form-group">
            <label>Education Level</label>
            <select name="educationLevel" value={form.educationLevel} onChange={handleChange} required>
              <option value="">Select</option>
              {educationOptions.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>University/College</label>
            <input name="university" value={form.university} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Graduation Year</label>
            <input name="graduationYear" type="number" value={form.graduationYear} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>GPA/Percentage</label>
            <input name="gpa" value={form.gpa} onChange={handleChange} required />
          </div>

          {/* Internship Details */}
          <div className="form-group">
            <label>Position Applied</label>
            <input name="position" value={form.position} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select</option>
              {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
          </div>
          {form.startDate && form.endDate && (
            <div className="form-group full-width">
              <label>Internship Duration</label>
              <div className="duration">{computeDuration(form.startDate, form.endDate)}</div>
            </div>
          )}
          <div className="form-group">
            <label>Remote Internship?</label>
            <input name="remote" type="checkbox" checked={form.remote} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Preferred Location</label>
            <input name="preferredLocation" value={form.preferredLocation} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Preferred Contact Method</label>
            <div className="radio-row">
              <label><input type="radio" name="contactMethod" value="Email" checked={form.contactMethod === 'Email'} onChange={handleContactMethodChange} /> Email</label>
              <label><input type="radio" name="contactMethod" value="Phone" checked={form.contactMethod === 'Phone'} onChange={handleContactMethodChange} /> Phone</label>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="form-group">
            <label>Skills (hold Ctrl to select multiple)</label>
            <select name="skills" multiple value={form.skills} onChange={handleChange}>
              {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Portfolio Link</label>
            <input name="portfolio" type="url" value={form.portfolio} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Resume Upload</label>
            <input name="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleChange} />
            {resumeName && <span style={{fontSize:'0.9em'}}>{resumeName}</span>}
          </div>

          {/* Preferences */}
          <div className="form-group">
            <label>Preferred Work Hours</label>
            <input name="workHours" value={form.workHours} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Expected Stipend</label>
            <input name="expectedStipend" type="number" value={form.expectedStipend} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Available From (Time)</label>
            <input name="availableFrom" type="time" value={form.availableFrom} onChange={handleChange} />
          </div>

          {/* Other */}
          <div className="form-group">
            <label>Reference (if any)</label>
            <input name="reference" value={form.reference} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cover Letter</label>
            <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={3} />
          </div>
          <div className="form-group">
            <label>Feedback/Suggestions</label>
            <textarea name="feedback" value={form.feedback} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label>
              <input name="agreeTerms" type="checkbox" checked={form.agreeTerms} onChange={handleChange} required />
              {' '}I agree to the terms and conditions
            </label>
          </div>
        </div>
        <button className="btn w-100 mb-3" type="submit">Submit Application</button>
      </form>
    </div>
  );
}
