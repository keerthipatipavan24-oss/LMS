import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import CourseCatalogue from "./pages/CourseCatalogue";
import CourseDetails from "./pages/CourseDetails";
import MyCourses from "./pages/MyCourses";
import LessonViewer from "./pages/LessonViewer";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import AdminManagement from "./pages/AdminManagement";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Area */}
      <div className="flex-1 min-w-0 min-h-screen flex flex-col">
        {/* Header */}
        <Header setIsOpen={setIsOpen} />

        {/* Pages */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<CourseCatalogue />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/learn/:id" element={<LessonViewer />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
