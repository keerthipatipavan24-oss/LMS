import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, SlidersHorizontal, X } from "lucide-react";

import defaultCourses from "../data/courses";
import CourseCard from "../components/CourseCard";

export default function MyCourses() {
  const navigate = useNavigate();

  // Read Courses from Local Storage
  const [courses] = useState(() => {
    try {
      const savedCourses = localStorage.getItem("courses");

      return savedCourses ? JSON.parse(savedCourses) : defaultCourses;
    } catch {
      return defaultCourses;
    }
  });

  // Get Enrolled Course IDs
  const [enrolledCourses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // Search, Filter and Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Get Enrolled Courses
  const myCourses = courses.filter((course) =>
    enrolledCourses.some((id) => String(id) === String(course.id)),
  );

  // Available Categories
  const categories = [
    "All",
    ...new Set(myCourses.map((course) => course.category).filter(Boolean)),
  ];

  // Calculate Course Progress
  const getCourseProgress = (course) => {
    try {
      const totalLessons = (course.lessonList || []).slice(0, 5).length;

      const savedCompleted = JSON.parse(
        localStorage.getItem(`completedLessons_${course.id}`) || "[]",
      );

      const completed = Array.isArray(savedCompleted)
        ? new Set(
            savedCompleted.filter(
              (index) =>
                Number.isInteger(index) && index >= 0 && index < totalLessons,
            ),
          )
        : new Set();

      return totalLessons > 0
        ? Math.round((completed.size / totalLessons) * 100)
        : 0;
    } catch {
      return 0;
    }
  };

  // Search and Category Filtering
  const filteredCourses = myCourses.filter((course) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      course.title?.toLowerCase().includes(search) ||
      course.instructor?.toLowerCase().includes(search) ||
      course.category?.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sorting
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.title.localeCompare(b.title);

      case "name-desc":
        return b.title.localeCompare(a.title);

      case "progress-high":
        return getCourseProgress(b) - getCourseProgress(a);

      case "progress-low":
        return getCourseProgress(a) - getCourseProgress(b);

      case "rating-high":
        return Number(b.rating || 0) - Number(a.rating || 0);

      case "rating-low":
        return Number(a.rating || 0) - Number(b.rating || 0);

      default:
        return 0;
    }
  });

  // Clear All Filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchTerm !== "" || selectedCategory !== "All" || sortBy !== "default";

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Courses
        </h1>

        <p className="text-gray-500 mt-2">
          Continue learning and track your enrolled courses.
        </p>
      </div>

      {/* Search and Filters */}
      {myCourses.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your courses..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-1 lg:max-w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-violet-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1 lg:max-w-60">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-violet-500"
              >
                <option value="default">Default Sorting</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="progress-high">Progress: Highest First</option>
                <option value="progress-low">Progress: Lowest First</option>
                <option value="rating-high">Rating: Highest First</option>
                <option value="rating-low">Rating: Lowest First</option>
              </select>
            </div>
          </div>

          {/* Filter Information */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <SlidersHorizontal size={16} />

              <span>
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {sortedCourses.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {myCourses.length}
                </span>{" "}
                courses
              </span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 transition"
              >
                <X size={15} />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Enrolled Courses */}
      {myCourses.length > 0 ? (
        sortedCourses.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Your Learning
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedCourses.map((course) => {
                const progress = getCourseProgress(course);

                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progress}
                    showProgress={true}
                    buttonText="Continue Learning"
                    onClick={() => navigate(`/learn/${course.id}`)}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          /* No Search Results */
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm text-center py-16 px-5">
            <div className="bg-violet-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search size={30} className="text-violet-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No Courses Found
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              We couldn't find any enrolled courses matching your search or
              filters.
            </p>

            <button
              onClick={clearFilters}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg mt-5 transition font-medium"
            >
              Clear Filters
            </button>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm text-center py-16 px-5">
          <div className="bg-violet-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-violet-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No Enrolled Courses Yet
          </h2>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Explore our catalogue and enrol in your first course to start your
            learning journey.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg mt-5 transition font-medium"
          >
            Explore Courses
          </button>
        </div>
      )}
    </div>
  );
}
