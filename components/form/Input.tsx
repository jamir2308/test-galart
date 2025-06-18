'use client';
import { InputProps } from '@/types/component.types';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', ...props }, ref) => (
    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
      {label}
      <input
        ref={ref}
        className={`rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/40 ${className}`}
        {...props}
      />
    </label>
  ),
);
Input.displayName = 'Input';
