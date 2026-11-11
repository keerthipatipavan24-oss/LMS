import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-5 right-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm">
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl bg-[#1C2130] ${
          isSuccess ? "border-green-500/40" : "border-red-500/40"
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="text-green-400 shrink-0" size={22} />
        ) : (
          <XCircle className="text-red-400 shrink-0" size={22} />
        )}

        <p className="text-white text-sm flex-1">{message}</p>

        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
