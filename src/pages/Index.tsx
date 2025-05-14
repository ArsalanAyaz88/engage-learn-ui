
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Shield, Users, Medal, Laptop } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header / Navigation */}
      <header className="bg-gray-800/70 backdrop-blur-sm border-b border-gray-700 shadow-lg py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">Course LMS</div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center py-20 px-6">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 animate-fade-in">
            <div>
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 inline-block mb-4">
                Premium Learning Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Elevate Your Skills with <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">Course LMS</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-lg mt-6">
                A comprehensive learning management system designed for modern education. Access courses anytime, anywhere.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 py-6 px-8 text-lg group">
                  Get Started 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/admin-login">
                <Button size="lg" variant="outline" className="py-6 px-8 text-lg border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
              <AspectRatio ratio={16/9}>
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80" 
                  alt="Learning Management System"
                  className="object-cover w-full h-full transition-transform hover:scale-105 duration-700"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 inline-block mb-4">
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Everything You Need in One Platform</h2>
            <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
              Designed to enhance your learning experience with powerful tools and features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: BookOpen, 
                title: "Interactive Courses", 
                description: "Engage with interactive course materials designed for optimal learning."
              },
              { 
                icon: Users, 
                title: "Community Learning", 
                description: "Connect with fellow learners and instructors for collaborative growth."
              },
              { 
                icon: Laptop, 
                title: "Self-paced Learning", 
                description: "Learn at your own pace with accessible content anytime, anywhere."
              },
              { 
                icon: Shield, 
                title: "Secure Platform", 
                description: "Your data and progress are always protected with enterprise-grade security."
              },
              { 
                icon: Medal, 
                title: "Certifications", 
                description: "Earn recognized certificates upon successful course completion."
              },
              { 
                icon: ArrowRight, 
                title: "Continuous Updates", 
                description: "Access to regularly updated content and new course offerings."
              },
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-indigo-500/50 transition-all duration-300 card-hover">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Links */}
      <section className="bg-gray-800 py-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Get Started Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Sign Up", description: "Create your account", link: "/signup", primary: true },
              { title: "User Login", description: "Access your dashboard", link: "/login" },
              { title: "Admin Login", description: "Administrative portal", link: "/admin-login" },
              { title: "Password Reset", description: "Recover your account", link: "/forgot-password" },
            ].map((item, index) => (
              <Link 
                key={index} 
                to={item.link}
                className={`rounded-xl p-6 transition-all hover:shadow-md ${
                  item.primary 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                } flex flex-col h-full card-hover`}
              >
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className={`text-sm ${item.primary ? "text-indigo-100" : "text-gray-300"}`}>{item.description}</p>
                <div className="mt-auto pt-4 flex justify-end">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text mb-4">Course LMS</div>
              <p className="text-gray-400 max-w-md">
                A comprehensive learning management system designed to help you achieve your educational goals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/signup" className="text-gray-400 hover:text-indigo-400 transition-colors">Get Started</Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-indigo-400 transition-colors">Login</Link>
                </li>
                <li>
                  <Link to="/admin-login" className="text-gray-400 hover:text-indigo-400 transition-colors">Admin Portal</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Help Center</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="text-gray-400 hover:text-indigo-400 transition-colors">Forgot Password</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Course LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
