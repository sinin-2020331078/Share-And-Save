import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const TrustScore = ({ score, size = 'md' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    if (score >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-lg',
          icon: 'text-lg'
        };
      default:
        return {
          container: 'px-3 py-1 text-sm',
          icon: 'text-sm'
        };
    }
  };

  const colorClasses = getScoreColor(score);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`inline-flex items-center gap-1 rounded-full ${colorClasses} ${sizeClasses.container}`}>
      <FaShieldAlt className={sizeClasses.icon} />
      <span className="font-medium">
        Trust: {score}%
      </span>
    </div>
  );
};

export default TrustScore;