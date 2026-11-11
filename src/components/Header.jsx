import { useLocation } from "react-router-dom";
import { Search, Menu, Bell, ChevronDown } from "lucide-react";

import defaultCourses from "../data/courses";

export default function Header({ setIsOpen }) {
  const location = useLocation();

  // Read courses from Local Storage
  const courses = (() => {
    try {
      const savedCourses = localStorage.getItem("courses");
      return savedCourses ? JSON.parse(savedCourses) : defaultCourses;
    } catch {
      return defaultCourses;
    }
  })();

  const pageTitles = {
    "/": "Dashboard",
    "/courses": "Course Catalogue",
    "/my-courses": "My Courses",
    "/profile": "My Profile",
    "/admin": "Admin Management",
  };

  // Get course from URL
  const courseMatch = location.pathname.match(
    /^\/(?:courses|learn|quiz)\/([^/]+)$/,
  );

  const selectedCourse = courseMatch
    ? courses.find((course) => String(course.id) === courseMatch[1])
    : null;

  const isQuizPage = location.pathname.startsWith("/quiz/");

  const pageTitle = isQuizPage
    ? "Course Quiz"
    : selectedCourse
      ? selectedCourse.title
      : pageTitles[location.pathname] || "LearnHub";

  return (
    <header className="sticky top-0 z-30 w-full shrink-0 bg-white border-b border-gray-200">
      <div className="min-h-[76px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            aria-label="Open sidebar"
          >
            <Menu size={23} />
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-lg w-44 md:w-64 focus-within:border-violet-400 transition">
            <Search size={18} className="text-gray-400 shrink-0" />

            <input
              type="text"
              placeholder="Search courses..."
              className="bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full min-w-0 text-sm"
            />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            aria-label="Notifications"
          >
            <Bell size={21} />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-200 pl-3 sm:pl-5">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              P
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">Pavan</p>

              <p className="text-xs text-gray-400">Student Account</p>
            </div>

            <ChevronDown size={17} className="hidden sm:block text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
