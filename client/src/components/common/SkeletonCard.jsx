import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-0 animate-pulse">
      <div className="w-full h-48 sm:h-52 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3.5 bg-slate-100 rounded w-full" />
        <div className="h-3.5 bg-slate-100 rounded w-4/5" />
        <div className="pt-3 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-16" />
          <div className="h-9 bg-slate-200 rounded-2xl w-24" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
