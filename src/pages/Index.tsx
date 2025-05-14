
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-lms-light flex flex-col">
      {/* Header / Navigation */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-lms-primary">Course LMS</div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-lms-dark">
              Welcome to the <span className="text-lms-primary">Course LMS</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-lg">
              A powerful learning management system designed to help you achieve your educational goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-lms-primary hover:bg-lms-secondary py-6 px-8 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/admin-login">
                <Button size="lg" variant="outline" className="py-6 px-8 text-lg">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
              alt="Learning Management System" 
              className="max-w-md w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Auth Links */}
      <section className="bg-white py-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Authentication Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Sign Up", description: "Create a new account", link: "/signup" },
              { title: "User Login", description: "Access your dashboard", link: "/login" },
              { title: "Admin Login", description: "Administrative access", link: "/admin-login" },
              { title: "Password Reset", description: "Recover your account", link: "/forgot-password" },
            ].map((item, index) => (
              <Link 
                key={index} 
                to={item.link}
                className="bg-gray-50 hover:bg-lms-light border border-gray-200 rounded-lg p-6 transition-all hover:shadow-md"
              >
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lms-dark text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Course LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
