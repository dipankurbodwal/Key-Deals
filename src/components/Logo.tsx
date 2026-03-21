import React from 'react';
import { Key } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = false }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8 rounded-lg', icon: 16, text: 'text-lg' },
    md: { container: 'w-10 h-10 rounded-xl', icon: 20, text: 'text-xl' },
    lg: { container: 'w-16 h-16 rounded-2xl', icon: 32, text: 'text-3xl' },
    xl: { container: 'w-24 h-24 rounded-3xl', icon: 48, text: 'text-5xl' },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "bg-[#002366] flex items-center justify-center shadow-lg",
        sizes[size].container
      )}>
        <Key 
          size={sizes[size].icon} 
          className="text-white" 
          strokeWidth={2.5}
        />
      </div>
      {showText && (
        <span className={cn(
          "font-bold tracking-tight text-[#002366]",
          sizes[size].text
        )}>
          Key Deals
        </span>
      )}
    </div>
  );
}
