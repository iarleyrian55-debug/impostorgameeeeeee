import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "font-bold text-lg py-4 px-6 rounded-2xl transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase tracking-wide shadow-lg";
  
  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300 border-b-4 border-yellow-600",
    secondary: "bg-zinc-800 text-yellow-400 hover:bg-zinc-700 border-b-4 border-zinc-950",
    danger: "bg-red-500 text-white hover:bg-red-400 border-b-4 border-red-700",
    ghost: "bg-transparent text-zinc-400 hover:text-white shadow-none border-none p-2",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};