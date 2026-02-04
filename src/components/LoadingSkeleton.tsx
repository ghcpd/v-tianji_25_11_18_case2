import React from 'react';

const LoadingSkeleton: React.FC = () => (
  <div className="loading-skeleton">
    <div className="loading-skeleton__bar" />
    <div className="loading-skeleton__bar" />
    <div className="loading-skeleton__bar" />
  </div>
);

export default LoadingSkeleton;
