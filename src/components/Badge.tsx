import React from 'react';

interface BadgeProps {
  count: number | string;
}

const Badge: React.FC<BadgeProps> = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white dark:border-[#0f172a]">
      {count}
    </span>
  );
};

export default Badge;
