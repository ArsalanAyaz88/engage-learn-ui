
import React from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { Google } from "lucide-react";

const SocialLogin: React.FC = () => {
  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-6 transition duration-300 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lms-primary/50"
        >
          <Google className="w-5 h-5 mr-2" />
          <span>Google</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;
