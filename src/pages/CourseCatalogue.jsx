import { useState } from "react";
import { Search, CheckCircle } from "lucide-react";

import defaultCourses from "../data/courses";
import CourseCard from "../components/CourseCard";

export default function CourseCatalogue() {
  // Read courses from Local Storage
  const [courses] = useState(() => {
    const savedCourses = localStorage.getItem("courses");

    return savedCourses ? JSON.parse(savedCourses) : defaultCourses;
  });

  // Read enrolled course IDs
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    return JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const categories = [
    "All",
    "Web Development",
    "Programming",
    "Data Science",
    "Design",
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  // Enroll in a course
  const handleEnroll = (courseId) => {
    if (enrolledCourses.includes(courseId)) {
      return;
    }

    const updatedEnrolledCourses = [...enrolledCourses, courseId];

    setEnrolledCourses(updatedEnrolledCourses);

    localStorage.setItem(
      "enrolledCourses",
      JSON.stringify(updatedEnrolledCourses),
    );
  };

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setSortBy("default");
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Description */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Explore Courses
        </h1>

        <p className="text-gray-500 mt-2">
          Explore our courses and find the right one for your learning journey.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "All Categories" : category}
              </option>
            ))}
          </select>

          {/* Level */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === "All" ? "All Levels" : level}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
          >
            <option value="default">Sort By: Default</option>
            <option value="rating">Rating: High to Low</option>
            <option value="name">Course Name: A-Z</option>
          </select>
        </div>

        {/* Filter Information */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredCourses.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {courses.length}
            </span>{" "}
            courses
          </p>

          {(searchTerm ||
            selectedCategory !== "All" ||
            selectedLevel !== "All" ||
            sortBy !== "default") && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Course Cards */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);

            return (
              <div key={course.id} className="w-full max-w-[320px] relative">
                {isEnrolled && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/95 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                    <CheckCircle size={13} />
                    Enrolled
                  </div>
                )}

                <CourseCard
                  course={course}
                  buttonText={isEnrolled ? "Enrolled" : "Enroll"}
                  onClick={() => handleEnroll(course.id)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
          <Search size={38} className="text-gray-300 mx-auto mb-3" />

          <h3 className="text-gray-900 font-semibold text-lg">
            No courses found
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Try another search or change your filters.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
