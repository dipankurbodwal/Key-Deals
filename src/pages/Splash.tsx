import React from 'react';
import { Key } from 'lucide-react';

export function Splash() {
  return (
    <div className="fixed inset-0 bg-[#A1BCDF] flex flex-col items-center justify-center z-50">
      <div className="animate-pulse">
        <img src="/favicon.svg" alt="Logo" className="w-32 h-32 rounded-3xl" />
      </div>
    </div>
  );
}
