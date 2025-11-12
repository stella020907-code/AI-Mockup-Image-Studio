import React from 'react';

const Loader: React.FC<{size?: 'sm' | 'md'}> = ({size = 'md'}) => {
  const sizeClass = size === 'sm' ? 'w-5 h-5 border-2' : 'w-8 h-8 border-4';
  return (
    <div className={`animate-spin rounded-full ${sizeClass} border-sky-400 border-t-transparent`}></div>
  );
};

export default Loader;
