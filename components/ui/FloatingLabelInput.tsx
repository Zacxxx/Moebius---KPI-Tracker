
import React, { InputHTMLAttributes } from 'react';
import { Label } from './Label';
import { Input } from './Input';

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ id, label, className, ...props }, ref) => {
    return (
      <div className="relative mt-2">
        <Input
          ref={ref}
          id={id}
          className={`peer ${className || ''}`}
          {...props}
        />
        <Label
          htmlFor={id}
          className="absolute left-3 -top-2.5 text-zinc-400 text-xs bg-zinc-900 px-1 transition-all"
        >
          {label}
        </Label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = 'FloatingLabelInput';
