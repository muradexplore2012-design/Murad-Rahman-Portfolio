import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-3xl font-extrabold mb-6 shadow-xl">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
        পেজটি খুঁজে পাওয়া যায়নি
      </h1>
      <p className="text-slate-400 text-sm sm:text-base max-w-md mb-8">
        আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি স্থানান্তরিত বা মুছে ফেলা হতে পারে।
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>হোমে ফিরে যান</span>
      </Link>
    </div>
  );
};
