import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
      <span className="text-6xl">🍕</span>
      <h1 className="text-4xl font-black text-slate-900">404 - Page Not Found</h1>
      <p className="text-slate-500 text-sm max-w-sm">
        Oops! The page you were looking for seems to have been eaten by a hungry foodie.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 shadow-md transition"
      >
        Back to CRAVE Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
