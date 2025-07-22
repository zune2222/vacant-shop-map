import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Container({
  children,
  className = "",
  maxWidth = "full",
  padding = "md",
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-none",
  };

  const paddingClasses = {
    none: "",
    sm: "px-2",
    md: "px-4",
    lg: "px-6",
  };

  return (
    <div
      className={`
      w-full mx-auto 
      ${maxWidthClasses[maxWidth]} 
      ${paddingClasses[padding]}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
