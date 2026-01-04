import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon';
  colorClass?: string;
  fullWidth?: boolean;
}

const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  colorClass,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  let baseStyles = "font-bold border-4 border-black transition-all duration-200 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] display-font text-sm md:text-base";
  
  // Shadow setup
  baseStyles += " shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1";

  // Color variants
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = colorClass || "bg-[#ccff00]"; // Default neon green
      break;
    case 'secondary':
      variantStyles = "bg-white";
      break;
    case 'danger':
      variantStyles = "bg-[#ff6b6b] text-black";
      break;
    case 'icon':
      variantStyles = "bg-white p-2 flex items-center justify-center aspect-square";
      break;
  }

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${widthStyle} ${variant !== 'icon' ? 'px-6 py-3' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeoButton;