import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Star,
  Clock,
  BookOpen,
  ArrowLeft,
  User,
  CheckCircle,
  GraduationCap,
} from "lucide-react";

import defaultCourses from "../data/courses";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Read courses from Local Storage
  const [courses] = useState(() => {
    const savedCourses = localStorage.getItem("courses");

    return savedCourses ? JSON.parse(savedCourses) : defaultCourses;
  });

  const course = courses.find((item) => String(item.id) === id);

  // Check enrollment status
  const enrolledCourses = JSON.parse(
    localStorage.getItem("enrolledCourses") || "[]",
  );

  const isEnrolled = course ? enrolledCourses.includes(course.id) : false;

  // Course not found
  if (!course) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Course Not Found</h2>

        <p className="text-gray-500 mt-2">
          The course you are looking for is unavailable.
        </p>

        <button
          onClick={() => navigate("/courses")}
          className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-gray-500 hover:text-violet-600 transition"
      >
        <ArrowLeft size={18} />
        Back to Courses
      </button>

      {/* Course Image */}
      <div className="w-full h-56 md:h-80 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-7 shadow-sm">
        {/* Category and Level */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-lg text-sm font-medium">
            {course.category}
          </span>

          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {course.title}
        </h1>

        <p className="text-gray-500 mt-3 leading-relaxed">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mt-5 text-gray-600">
          <User size={20} className="text-violet-600" />
          <span>Instructor: {course.instructor}</span>
        </div>

        {/* Course Statistics */}
        <div className="flex flex-wrap gap-6 mt-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" />
            <span>{course.rating} Rating</span>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-violet-600" />
            <span>{course.lessons} Lessons</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={18} className="text-violet-600" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Course Action */}
        <div className="mt-7">
          {isEnrolled ? (
            <button
              onClick={() => navigate("/my-courses")}
              className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <CheckCircle size={18} />
              Go to My Courses
            </button>
          ) : (
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <GraduationCap size={19} />
              Explore Courses
            </button>
          )}
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Course Curriculum
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Topics covered in this course.
            </p>
          </div>

          <span className="text-violet-700 bg-violet-50 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
            {course.lessonList?.length || 0} Topics
          </span>
        </div>

        <div className="space-y-3">
          {(course.lessonList || []).map((lesson, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 sm:p-4 rounded-lg"
            >
              <span className="text-violet-600 font-semibold text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="text-gray-700 text-sm font-medium">
                {lesson}
              </span>

              <div className="ml-auto shrink-0">
                <BookOpen size={17} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
