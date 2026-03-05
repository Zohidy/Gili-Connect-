import React from 'react';
import { IslandRole } from '../types';

interface RoleBadgeProps {
  role: IslandRole;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeStyle = (role: IslandRole) => {
    switch (role) {
      case 'Admin': return 'badge-role-admin';
      case 'Moderator': return 'badge-role-moderator';
      case 'Supporter': return 'badge-role-supporter';
      case 'Local': return 'badge-role-local';
      case 'Business': return 'badge-role-business';
      default: return 'badge-role-tourist'; // Tourist
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${getBadgeStyle(role)}`}>
      {role}
    </span>
  );
};

export default RoleBadge;
