import React from 'react';
import { Logo } from '../components/Logo';

export function Splash() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="animate-pulse">
        <Logo size="xl" />
      </div>
    </div>
  );
}
