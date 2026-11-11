import { BookOpen, CheckCircle } from "lucide-react";

export default function LessonItem({
  title,
  index,
  isActive = false,
  isCompleted = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
        isActive
          ? "bg-violet-600/20 border border-violet-500"
          : "bg-[#202432] hover:bg-gray-700"
      }`}
    >
      <BookOpen size={18} className="text-violet-400 shrink-0" />

      <span className="text-gray-300 text-sm flex-1">
        {index + 1}. {title}
      </span>

      {isCompleted && (
        <CheckCircle size={18} className="text-green-400 shrink-0" />
      )}
    </button>
  );
}
