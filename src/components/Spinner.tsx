import React from 'react';
import './Spinner.css';

export const Spinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  return <div className={`spinner spinner-${size}`}></div>;
};
