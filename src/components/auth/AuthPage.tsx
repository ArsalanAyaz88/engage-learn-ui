
import React from "react";
import { cn } from "@/lib/utils";

interface AuthPageProps {
  children: React.ReactNode;
  imageSide?: "left" | "right";
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({
  children,
  imageSide = "left",
  imageUrl = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
  imageAlt = "Learning Management System",
  className,
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col md:flex-row w-full", className)}>
      {/* Image Section - Order changes based on imageSide prop */}
      <div 
        className={cn(
          "flex-1 bg-cover bg-center hidden md:block min-h-[30vh]", 
          imageSide === "right" ? "order-2" : "order-1"
        )}
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-label={imageAlt}
      >
        <div className="w-full h-full bg-gradient-to-r from-black/50 to-black/30 flex items-center justify-center">
          <div className="text-white p-8 max-w-md">
            <h2 className="text-3xl font-bold mb-4 animate-fade-in" style={{animationDelay: "0.2s"}}>
              Expand Your Knowledge
            </h2>
            <p className="text-lg opacity-90 animate-fade-in" style={{animationDelay: "0.4s"}}>
              Learn, grow, and achieve your goals with our comprehensive learning platform.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className={cn(
        "flex-1 flex items-center justify-center p-6 md:p-12 bg-white", 
        imageSide === "right" ? "order-1" : "order-2"
      )}>
        {children}
      </div>
    </div>
  );
};

export default AuthPage;
