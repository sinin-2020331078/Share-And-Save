import React from 'react';
import { FaGift, FaHandshake, FaStar, FaTrophy, FaMedal } from 'react-icons/fa';

const UserBadges = ({ badges, size = 'sm' }) => {
  const getBadgeConfig = (badge) => {
    switch (badge) {
      case 'Super Sharer':
        return {
          icon: <FaGift />,
          color: 'bg-gradient-to-r from-pink-400 to-pink-600',
          title: 'Super Sharer - Shared 50+ items'
        };
      case 'Generous Giver':
        return {
          icon: <FaGift />,
          color: 'bg-gradient-to-r from-green-400 to-green-600',
          title: 'Generous Giver - Shared 20+ items'
        };
      case 'Community Helper':
        return {
          icon: <FaGift />,
          color: 'bg-gradient-to-r from-blue-400 to-blue-600',
          title: 'Community Helper - Shared 5+ items'
        };
      case 'Transaction Master':
        return {
          icon: <FaTrophy />,
          color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
          title: 'Transaction Master - 100+ successful transactions'
        };
      case 'Reliable Trader':
        return {
          icon: <FaHandshake />,
          color: 'bg-gradient-to-r from-purple-400 to-purple-600',
          title: 'Reliable Trader - 50+ successful transactions'
        };
      case 'Trusted Exchanger':
        return {
          icon: <FaHandshake />,
          color: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
          title: 'Trusted Exchanger - 10+ successful transactions'
        };
      case 'Reputation Star':
        return {
          icon: <FaStar />,
          color: 'bg-gradient-to-r from-yellow-300 to-yellow-500',
          title: 'Reputation Star - 1000+ reputation points'
        };
      case 'Community Leader':
        return {
          icon: <FaMedal />,
          color: 'bg-gradient-to-r from-orange-400 to-orange-600',
          title: 'Community Leader - 500+ reputation points'
        };
      default:
        return {
          icon: <FaStar />,
          color: 'bg-gradient-to-r from-gray-400 to-gray-600',
          title: badge
        };
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4 text-xs';
      case 'sm':
        return 'w-6 h-6 text-sm';
      case 'md':
        return 'w-8 h-8 text-base';
      case 'lg':
        return 'w-10 h-10 text-lg';
      default:
        return 'w-6 h-6 text-sm';
    }
  };

  if (!badges || badges.length === 0) {
    return null;
  }

  const sizeClasses = getSizeClasses(size);

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge, index) => {
        const config = getBadgeConfig(badge);
        return (
          <div
            key={index}
            className={`${config.color} ${sizeClasses} rounded-full flex items-center justify-center text-white shadow-sm`}
            title={config.title}
          >
            {config.icon}
          </div>
        );
      })}
    </div>
  );
};

export default UserBadges;