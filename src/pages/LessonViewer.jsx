import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  BookOpen,
} from "lucide-react";

import defaultCourses from "../data/courses";

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Read courses from Local Storage
  const [courses] = useState(() => {
    try {
      const savedCourses = localStorage.getItem("courses");

      return savedCourses ? JSON.parse(savedCourses) : defaultCourses;
    } catch {
      return defaultCourses;
    }
  });

  // Find current course
  const course = courses.find((item) => String(item.id) === String(id));

  // Keep a maximum of 5 lessons
  const lessons = (course?.lessonList || []).slice(0, 5);

  // Read the last opened lesson
  const [currentLesson, setCurrentLesson] = useState(() => {
    const savedLesson = Number(localStorage.getItem(`lastLesson_${id}`) || 0);

    return Number.isInteger(savedLesson) && savedLesson >= 0 ? savedLesson : 0;
  });

  // Read completed lessons
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(`completedLessons_${id}`) || "[]",
      );

      return Array.isArray(saved)
        ? saved.filter(
            (index) => Number.isInteger(index) && index >= 0 && index < 5,
          )
        : [];
    } catch {
      return [];
    }
  });

  // Keep the current lesson within the available range
  const activeLesson =
    lessons.length > 0 ? Math.min(currentLesson, lessons.length - 1) : 0;

  // Valid completed lessons
  const validCompletedLessons = completedLessons.filter(
    (index) => index >= 0 && index < lessons.length,
  );

  // Save completed lessons
  useEffect(() => {
    localStorage.setItem(
      `completedLessons_${id}`,
      JSON.stringify(validCompletedLessons),
    );
  }, [completedLessons, id, lessons.length]);

  // Save the last opened lesson
  useEffect(() => {
    if (lessons.length > 0) {
      localStorage.setItem(`lastLesson_${id}`, String(activeLesson));
    }
  }, [activeLesson, id, lessons.length]);

  // Course not found
  if (!course) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>

        <p className="text-gray-500 mt-2">
          The course you are looking for is unavailable.
        </p>

        <button
          onClick={() => navigate("/courses")}
          className="text-violet-600 hover:text-violet-700 mt-4 font-medium"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // Handle courses without lessons
  if (lessons.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-800">{course.title}</h2>

        <p className="text-gray-500 mt-3">
          No lessons are available for this course yet.
        </p>

        <button
          onClick={() => navigate("/my-courses")}
          className="text-violet-600 hover:text-violet-700 mt-4 font-medium"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  // Current lesson title
  const lesson = lessons[activeLesson];

  // Get notes matching the selected lesson
  const lessonNote =
    course.lessonNotes?.[activeLesson]?.trim() ||
    "No lesson notes have been added for this topic yet.";

  // Course progress
  const progress = Math.round(
    (validCompletedLessons.length / lessons.length) * 100,
  );

  const isCompleted = validCompletedLessons.includes(activeLesson);

  // Mark lesson as completed
  const markAsCompleted = () => {
    if (!isCompleted) {
      setCompletedLessons((previous) => [
        ...new Set([...previous, activeLesson]),
      ]);
    }
  };

  // Previous lesson
  const previousLesson = () => {
    if (activeLesson > 0) {
      setCurrentLesson(activeLesson - 1);
    }
  };

  // Next lesson
  const nextLesson = () => {
    if (activeLesson < lessons.length - 1) {
      setCurrentLesson(activeLesson + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/my-courses")}
        className="flex items-center gap-2 text-gray-500 hover:text-violet-600 transition"
      >
        <ArrowLeft size={18} />
        Back to My Courses
      </button>

      {/* Course Header */}
      <div>
        <div className="flex items-center gap-2 text-violet-600 text-sm font-medium mb-2">
          <BookOpen size={17} />
          Learning Centre
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          {course.title}
        </h1>

        <p className="text-gray-500 mt-2">
          Continue your learning journey and complete each lesson.
        </p>
      </div>

      {/* Progress Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="font-semibold text-slate-800">Course Progress</h2>

            <p className="text-gray-500 text-sm mt-1">
              {validCompletedLessons.length} of {lessons.length} lessons
              completed
            </p>
          </div>

          <span className="text-violet-600 font-bold text-xl">{progress}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-violet-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Lesson List */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Course Lessons
          </h2>

          <div className="space-y-3">
            {lessons.map((item, index) => {
              const isActive = activeLesson === index;

              const isLessonCompleted = validCompletedLessons.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => setCurrentLesson(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                    isActive
                      ? "bg-violet-50 border-violet-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
                      isLessonCompleted
                        ? "bg-green-100 text-green-600"
                        : isActive
                          ? "bg-violet-100 text-violet-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isLessonCompleted ? (
                      <CheckCircle size={19} />
                    ) : (
                      <PlayCircle size={19} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs mb-1 ${
                        isActive ? "text-violet-600" : "text-gray-400"
                      }`}
                    >
                      Lesson {index + 1}
                    </p>

                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-violet-700" : "text-slate-700"
                      }`}
                    >
                      {item}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side - Lesson Content */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
          {/* Lesson Number */}
          <div className="flex items-center gap-2 text-violet-600 text-sm font-medium mb-4">
            <PlayCircle size={18} />
            Lesson {activeLesson + 1} of {lessons.length}
          </div>

          {/* Select Lesson */}
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Select Lesson
            </label>

            <select
              value={activeLesson}
              onChange={(event) => setCurrentLesson(Number(event.target.value))}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              {lessons.map((item, index) => (
                <option key={index} value={index}>
                  {index + 1}. {item}
                </option>
              ))}
            </select>
          </div>

          {/* Current Lesson Content */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 md:p-8 min-h-64">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              {lesson}
            </h2>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-violet-600 mb-2">
                Lesson Overview
              </h3>

              <p className="text-gray-600 leading-7 text-sm md:text-base whitespace-pre-line">
                {lessonNote}
              </p>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600 mt-6 bg-green-50 border border-green-100 rounded-lg p-3">
                <CheckCircle size={19} />

                <span className="text-sm font-medium">
                  You have completed this lesson.
                </span>
              </div>
            )}
          </div>

          {/* Mark as Completed */}
          <button
            onClick={markAsCompleted}
            disabled={isCompleted}
            className={`flex items-center justify-center gap-2 mt-6 px-5 py-3 rounded-lg font-medium transition ${
              isCompleted
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}
          >
            <CheckCircle size={18} />

            {isCompleted ? "Lesson Completed" : "Mark as Completed"}
          </button>

          {/* Previous and Next Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={previousLesson}
              disabled={activeLesson === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            <button
              onClick={nextLesson}
              disabled={activeLesson === lessons.length - 1}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate(`/quiz/${id}`)}
              className="col-span-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
            >
              Take Course Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
