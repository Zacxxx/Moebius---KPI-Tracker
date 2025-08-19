import React from 'react';

const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500',
  secondary: 'bg-zinc-700/50 text-zinc-200 hover:bg-zinc-700 focus:ring-zinc-500',
  ghost: 'bg-transparent text-zinc-200 hover:bg-zinc-800 focus:ring-zinc-500',
};

const sizes = {
  default: 'px-4 py-2',
  icon: 'h-10 w-10',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'default',
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
