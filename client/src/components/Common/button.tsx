import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-[#040506]";

  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-white/20 text-white hover:bg-white/10",
    ghost: "hover:bg-white/10 text-white/80",
  };

  const sizeStyles = {
    default: "h-10 py-2 px-4 rounded-md",
    sm: "h-9 px-3 rounded-md text-sm",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
