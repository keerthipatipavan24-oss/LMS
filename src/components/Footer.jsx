import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "My Courses", path: "/my-courses" },
    { name: "My Profile", path: "/profile" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <footer className="w-full bg-[#191D2B] border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-9 sm:py-10 lg:py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 shrink-0"
          >
            <GraduationCap size={30} className="text-violet-400" />

            <span className="text-xl font-bold text-white">
              Learn<span className="text-violet-400">Hub</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-x-7 sm:gap-x-9 gap-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-gray-400 hover:text-violet-400 transition-colors duration-200 whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
