import { BookOpen, Clock, Star } from "lucide-react";

export default function CourseCard({
  course,
  progress = 0,
  buttonText = "View Course",
  onClick,
  showProgress = false,
}) {
  return (
    <div className="w-full max-w-[320px] mx-auto h-full min-w-0 flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-violet-300 transition-all duration-300">
      {/* Course Image */}
      <div className="w-full h-36 shrink-0 overflow-hidden bg-gray-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Course Information */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category and Level */}
        <div className="flex flex-wrap items-start gap-2 mb-3 min-h-[48px]">
          <span className="bg-violet-50 text-violet-700 px-2.5 py-1 rounded-lg text-xs font-medium h-fit">
            {course.category}
          </span>

          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium h-fit">
            {course.level}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 min-h-[48px] line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-gray-500 text-xs sm:text-sm mb-3 min-h-[32px]">
          Instructor: {course.instructor}
        </p>

        {/* Course Details */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-gray-500 text-xs sm:text-sm mb-3 min-h-[36px]">
          <div className="flex items-center gap-1">
            <BookOpen size={15} className="shrink-0 text-violet-500" />
            <span>{course.lessons} Lessons</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={15} className="shrink-0 text-violet-500" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 text-sm mb-3">
            <Star
              size={16}
              className="text-yellow-500 fill-yellow-500 shrink-0"
            />
            <span className="text-gray-700 font-medium">{course.rating}</span>
          </div>

          {/* Course Progress */}
          {showProgress && (
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                <span className="text-gray-500">Course Progress</span>

                <span className="text-violet-700 font-semibold tabular-nums">
                  {progress}%
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, progress))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Button */}
          <button
            onClick={onClick}
            className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
