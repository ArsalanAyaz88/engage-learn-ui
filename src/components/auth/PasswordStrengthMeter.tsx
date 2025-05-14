
import React, { useMemo } from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    return Math.min(score, 4); // Cap at 4
  }, [password]);
  
  const getLabel = () => {
    if (!password) return "";
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return labels[Math.max(0, strength - 1)];
  };
  
  const getColor = () => {
    if (!password) return "bg-gray-200";
    const colors = [
      "bg-red-500", // Weak
      "bg-orange-500", // Fair
      "bg-yellow-500", // Good
      "bg-green-500", // Strong
    ];
    return colors[Math.max(0, strength - 1)];
  };

  if (!password) return null;

  return (
    <div className="mt-1 mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Password strength</span>
        <span className="text-xs font-medium">{getLabel()}</span>
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden flex">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-full transition-all duration-300 ${
              i < strength ? getColor() : "bg-gray-200"
            }`}
            style={{ width: "25%" }}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
