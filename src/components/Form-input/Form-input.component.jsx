import React from 'react';

import './Form-input.styles.scss';

const FormInput = ({ handleChange, label, ...otherProps }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <input className="form-control" onChange={handleChange} {...otherProps} />
  </div>
);

export default FormInput;