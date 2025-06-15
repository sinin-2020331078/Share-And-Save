import React from 'react';
import { FaStar, FaTrophy, FaMedal, FaAward, FaGem } from 'react-icons/fa';

const ReputationBadge = ({ level, points, size = 'md', showPoints = true }) => {
  const getBadgeConfig = (level) => {
    switch (level) {
      case 'Community Champion':
        return {
          icon: <FaTrophy />,
          color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
          textColor: 'text-yellow-800',
          bgColor: 'bg-yellow-100'
        };
      case 'Trusted Member':
        return {
          icon: <FaGem />,
          color: 'bg-gradient-to-r from-purple-400 to-purple-600',
          textColor: 'text-purple-800',
          bgColor: 'bg-purple-100'
        };
      case 'Active Contributor':
        return {
          icon: <FaMedal />,
          color: 'bg-gradient-to-r from-blue-400 to-blue-600',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-100'
        };
      case 'Community Member':
        return {
          icon: <FaAward />,
          color: 'bg-gradient-to-r from-green-400 to-green-600',
          textColor: 'text-green-800',
          bgColor: 'bg-green-100'
        };
      default:
        return {
          icon: <FaStar />,
          color: 'bg-gradient-to-r from-gray-400 to-gray-600',
          textColor: 'text-gray-800',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'text-xs',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-lg',
          icon: 'text-lg',
          text: 'text-lg'
        };
      default:
        return {
          container: 'px-3 py-1 text-sm',
          icon: 'text-sm',
          text: 'text-sm'
        };
    }
  };

  const config = getBadgeConfig(level);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${config.bgColor} ${sizeClasses.container}`}>
      <div className={`${config.color} p-1 rounded-full text-white ${sizeClasses.icon}`}>
        {config.icon}
      </div>
      <span className={`font-medium ${config.textColor} ${sizeClasses.text}`}>
        {level}
      </span>
      {showPoints && (
        <span className={`font-bold ${config.textColor} ${sizeClasses.text}`}>
          ({points})
        </span>
      )}
    </div>
  );
};

export default ReputationBadge;