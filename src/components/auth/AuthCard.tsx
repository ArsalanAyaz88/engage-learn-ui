
import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={cn("w-full max-w-md mx-auto auth-form-container", className)}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-gray-600 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
