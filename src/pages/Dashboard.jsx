import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle, GraduationCap, TrendingUp } from "lucide-react";

import defaultCourses from "../data/courses";
import CourseCard from "../components/CourseCard";

export default function Dashboard() {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Read courses from Local Storage
  const savedCourses = localStorage.getItem("courses");
  const courses = savedCourses ? JSON.parse(savedCourses) : defaultCourses;

  // Get enrolled course IDs
  const enrolledCourses = JSON.parse(
    localStorage.getItem("enrolledCourses") || "[]",
  );

  // Find enrolled course details
  const myCourses = courses.filter((course) =>
    enrolledCourses.includes(course.id),
  );

  // Calculate completed lessons
  let completedLessons = 0;
  let totalLessons = 0;

  myCourses.forEach((course) => {
    const completed = JSON.parse(
      localStorage.getItem(`completedLessons_${course.id}`) || "[]",
    );

    completedLessons += completed.length;
    totalLessons += course.lessonList?.length || 0;
  });

  // Calculate overall progress
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const stats = [
    {
      title: "Enrolled Courses",
      value: myCourses.length,
      icon: GraduationCap,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Completed Lessons",
      value: completedLessons,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Lessons",
      value: totalLessons,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Quiz Attempts",
      value: JSON.parse(localStorage.getItem("quizResults") || "[]").length,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, Pavan!
        </h1>

        <p className="text-gray-500 mt-2">
          Continue your learning journey and achieve your goals.
        </p>

        <p className="text-gray-400 text-sm mt-2">{today}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="min-w-0 bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-gray-500 text-sm">{stat.title}</p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </h2>
                </div>

                <div className={`${stat.bg} p-3 rounded-xl shrink-0`}>
                  <Icon size={25} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Learning Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Overall Learning Progress
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Track your learning journey.
            </p>
          </div>

          <span className="text-violet-600 font-bold text-xl">
            {overallProgress}%
          </span>
        </div>

        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-violet-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <p className="text-gray-500 text-sm mt-3">
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Enrolled Courses */}
      <div>
        <div className="flex justify-between items-center gap-3 mb-5">
          <h2 className="text-xl font-bold text-gray-900">Enrolled Courses</h2>

          <button
            onClick={() => navigate("/my-courses")}
            className="text-violet-600 hover:text-violet-700 text-sm font-medium whitespace-nowrap"
          >
            View All
          </button>
        </div>

        {myCourses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
            <BookOpen size={40} className="text-gray-400 mx-auto mb-3" />

            <h3 className="text-gray-900 font-semibold">
              No enrolled courses yet
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Explore the course catalogue and start learning.
            </p>

            <button
              onClick={() => navigate("/courses")}
              className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg transition"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-6">
            {myCourses.map((course) => {
              const completed = JSON.parse(
                localStorage.getItem(`completedLessons_${course.id}`) || "[]",
              );

              const totalCourseLessons = course.lessonList?.length || 0;

              const progress =
                totalCourseLessons > 0
                  ? Math.round((completed.length / totalCourseLessons) * 100)
                  : 0;

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
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button
            onClick={() => navigate("/courses")}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-violet-300"
          >
            <BookOpen className="text-violet-600 mb-3" size={25} />

            <h3 className="text-gray-900 font-semibold">Explore Courses</h3>

            <p className="text-gray-500 text-sm mt-1">
              Discover new courses and skills.
            </p>
          </button>

          <button
            onClick={() => navigate("/my-courses")}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-violet-300"
          >
            <GraduationCap className="text-emerald-600 mb-3" size={25} />

            <h3 className="text-gray-900 font-semibold">My Courses</h3>

            <p className="text-gray-500 text-sm mt-1">
              View your enrolled courses.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
