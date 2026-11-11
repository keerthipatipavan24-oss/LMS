import { NavLink } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Library,
  UserRound,
  Settings,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Course Catalogue", path: "/courses", icon: BookOpen },
    { name: "My Courses", path: "/my-courses", icon: Library },
    { name: "My Profile", path: "/profile", icon: UserRound },
    { name: "Admin Management", path: "/admin", icon: Settings },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-violet-50 text-violet-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-violet-700"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky
          top-0 left-0
          z-50
          h-screen
          w-64 shrink-0
          bg-white
          border-r border-gray-200
          flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 shrink-0 px-6 flex items-center justify-between border-b border-gray-100">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="bg-violet-600 p-2 rounded-lg">
              <GraduationCap size={24} className="text-white" />
            </div>

            <span className="text-xl font-bold text-gray-900">
              Learn<span className="text-violet-600">Hub</span>
            </span>
          </NavLink>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-900"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-4">
            Main Menu
          </p>

          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setIsOpen(false)}
                className={linkClass}
              >
                <Icon size={19} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 p-4 border-t border-gray-100">
          <div className="bg-violet-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-violet-700">
              <GraduationCap size={20} />
              <span className="text-sm font-semibold">LearnHub</span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Keep learning. Keep growing.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
