import React from 'react';

export default function FormField({ label, children }) {
  return (
    <div className="form-group form-field">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}
