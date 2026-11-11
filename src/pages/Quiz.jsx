import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

import defaultCourses from "../data/courses";

// Existing manually created course quizzes
const defaultQuizQuestions = {
  1: [
    {
      question: "What is the main purpose of React?",
      options: [
        "Database management",
        "Building user interfaces",
        "Server management",
        "Operating systems",
      ],
      answer: "Building user interfaces",
    },
    {
      question: "Which language is primarily used with React?",
      options: ["Python", "Java", "JavaScript", "C++"],
      answer: "JavaScript",
    },
    {
      question: "Which hook is used to manage state in React?",
      options: ["useEffect", "useState", "useRef", "useContext"],
      answer: "useState",
    },
    {
      question: "What is JSX?",
      options: [
        "A database",
        "A CSS framework",
        "A JavaScript syntax extension",
        "A programming language",
      ],
      answer: "A JavaScript syntax extension",
    },
    {
      question: "Which method is commonly used to render lists in React?",
      options: [".filter()", ".map()", ".reduce()", ".find()"],
      answer: ".map()",
    },
  ],

  2: [
    {
      question: "Which keyword declares a block-scoped variable?",
      options: ["var", "let", "define", "static"],
      answer: "let",
    },
    {
      question: "Which data type represents true or false?",
      options: ["String", "Number", "Boolean", "Object"],
      answer: "Boolean",
    },
    {
      question: "Which operator checks both value and type?",
      options: ["==", "=", "===", "!="],
      answer: "===",
    },
    {
      question: "Which statement is used for decision making?",
      options: ["if...else", "for", "while", "break"],
      answer: "if...else",
    },
    {
      question: "Which method adds an item to the end of an array?",
      options: ["pop()", "shift()", "push()", "slice()"],
      answer: "push()",
    },
  ],

  3: [
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "func", "def", "method"],
      answer: "def",
    },
    {
      question: "Which symbol is used for single-line comments in Python?",
      options: ["//", "#", "/*", "--"],
      answer: "#",
    },
    {
      question: "Which data type stores key-value pairs?",
      options: ["List", "Tuple", "Dictionary", "Set"],
      answer: "Dictionary",
    },
    {
      question: "Which function displays output in Python?",
      options: ["display()", "echo()", "print()", "write()"],
      answer: "print()",
    },
    {
      question: "Which keyword is used to create a loop over a sequence?",
      options: ["repeat", "for", "loop", "iterate"],
      answer: "for",
    },
  ],

  4: [
    {
      question: "What is Data Science mainly used for?",
      options: [
        "Designing websites",
        "Extracting insights from data",
        "Creating operating systems",
        "Managing hardware",
      ],
      answer: "Extracting insights from data",
    },
    {
      question: "Which Python library is commonly used for data analysis?",
      options: ["Pandas", "Flask", "Django", "Pygame"],
      answer: "Pandas",
    },
    {
      question: "What does EDA stand for?",
      options: [
        "Electronic Data Application",
        "Exploratory Data Analysis",
        "External Data Access",
        "Enhanced Database Architecture",
      ],
      answer: "Exploratory Data Analysis",
    },
    {
      question: "Which library is commonly used for numerical computing?",
      options: ["NumPy", "React", "Express", "Bootstrap"],
      answer: "NumPy",
    },
    {
      question: "What is the purpose of data cleaning?",
      options: [
        "Delete all data",
        "Improve data quality",
        "Create animations",
        "Design interfaces",
      ],
      answer: "Improve data quality",
    },
  ],

  5: [
    {
      question: "What does UI stand for?",
      options: [
        "User Interface",
        "Universal Internet",
        "User Integration",
        "Unified Information",
      ],
      answer: "User Interface",
    },
    {
      question: "What does UX primarily focus on?",
      options: [
        "Server performance",
        "User experience",
        "Database storage",
        "Programming syntax",
      ],
      answer: "User experience",
    },
    {
      question: "What is a wireframe?",
      options: [
        "A database table",
        "A basic layout of a design",
        "A programming language",
        "A finished application",
      ],
      answer: "A basic layout of a design",
    },
    {
      question: "What is the purpose of user research?",
      options: [
        "Understand user needs",
        "Increase code size",
        "Create databases",
        "Manage servers",
      ],
      answer: "Understand user needs",
    },
    {
      question: "What is a prototype?",
      options: [
        "A final database",
        "An interactive design model",
        "A programming framework",
        "A server configuration",
      ],
      answer: "An interactive design model",
    },
  ],

  6: [
    {
      question: "Which keyword is used to define a class in Java?",
      options: ["function", "class", "struct", "object"],
      answer: "class",
    },
    {
      question: "Which concept allows a class to inherit another class?",
      options: ["Encapsulation", "Inheritance", "Abstraction", "Compilation"],
      answer: "Inheritance",
    },
    {
      question: "Which method is the entry point of a Java application?",
      options: ["start()", "run()", "main()", "execute()"],
      answer: "main()",
    },
    {
      question:
        "Which keyword is used to prevent a class from being inherited?",
      options: ["static", "final", "private", "protected"],
      answer: "final",
    },
    {
      question: "Which block is used to handle exceptions in Java?",
      options: ["try-catch", "if-else", "for-loop", "switch-case"],
      answer: "try-catch",
    },
  ],
};

// Safely read quiz results
const getQuizResults = () => {
  try {
    const results = JSON.parse(localStorage.getItem("quizResults") || "[]");

    return Array.isArray(results) ? results : [];
  } catch {
    return [];
  }
};

export default function Quiz() {
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

  // Find selected course
  const course = courses.find((item) => String(item.id) === String(id));

  // Get course-specific questions or existing default questions
  const questions =
    course?.quizQuestions?.length > 0
      ? course.quizQuestions
      : defaultQuizQuestions[Number(id)] || [];

  // Read the latest saved quiz result for this course
  const [savedResult] = useState(() => {
    const results = getQuizResults();

    return (
      [...results]
        .reverse()
        .find((result) => String(result.courseId) === String(id)) || null
    );
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(!!savedResult);
  const [resultData, setResultData] = useState(savedResult);

  // Course not found
  if (!course) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>

        <button
          onClick={() => navigate("/my-courses")}
          className="text-violet-600 hover:text-violet-700 mt-4 font-medium"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  // Quiz unavailable
  if (questions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-800">Quiz Unavailable</h2>

        <p className="text-gray-500 mt-2">
          Quiz questions have not been added for this course yet. Please contact
          the administrator.
        </p>

        <button
          onClick={() => navigate(`/learn/${id}`)}
          className="text-violet-600 hover:text-violet-700 mt-4 font-medium"
        >
          Back to Lessons
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  // Select answer
  const handleAnswer = (option) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [currentQuestion]: option,
    }));
  };

  // Calculate score
  const calculateScore = () => {
    return questions.filter(
      (item, index) => selectedAnswers[index] === item.answer,
    ).length;
  };

  // Submit quiz
  const handleSubmit = () => {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    const result = {
      attemptId: Date.now(),
      courseId: course.id,
      courseName: course.title,
      score,
      totalQuestions: questions.length,
      percentage,
      date: new Date().toISOString(),
    };

    const previousResults = getQuizResults();

    // Save every attempt without replacing previous results
    const updatedResults = [...previousResults, result];

    localStorage.setItem("quizResults", JSON.stringify(updatedResults));

    setResultData(result);
    setShowResult(true);
  };

  // Retake quiz
  const handleRetake = () => {
    // Previous attempts remain saved in Local Storage
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setResultData(null);
    setShowResult(false);
  };

  const score = resultData?.score ?? 0;
  const percentage = resultData?.percentage ?? 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/learn/${id}`)}
        className="flex items-center gap-2 text-gray-500 hover:text-violet-600 transition"
      >
        <ArrowLeft size={18} />
        Back to Lessons
      </button>

      {/* Quiz Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Course Quiz
        </h1>

        <p className="text-gray-500 mt-2">{course.title}</p>
      </div>

      {!showResult ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-8 shadow-sm">
          {/* Question Progress */}
          <div className="flex justify-between items-center mb-5 gap-3">
            <span className="text-violet-600 font-semibold text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="text-gray-500 text-sm">
              {Object.keys(selectedAnswers).length} / {questions.length}{" "}
              Answered
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question */}
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-6">
            {question.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === option;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border transition ${
                    isSelected
                      ? "bg-violet-50 border-violet-500 text-violet-700"
                      : "bg-white border-gray-200 text-slate-700 hover:border-violet-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>

                  {option}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 mt-8">
            <button
              onClick={() => setCurrentQuestion((previous) => previous - 1)}
              disabled={currentQuestion === 0}
              className="px-5 py-3 rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((previous) => previous + 1)}
                disabled={!selectedAnswers[currentQuestion]}
                className="px-5 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={
                  Object.keys(selectedAnswers).length !== questions.length
                }
                className="px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Result */
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm text-center">
          {percentage >= 70 ? (
            <Trophy size={55} className="text-yellow-500 mx-auto" />
          ) : (
            <XCircle size={55} className="text-orange-500 mx-auto" />
          )}

          <h2 className="text-2xl font-bold text-slate-800 mt-5">
            Quiz Completed!
          </h2>

          <p className="text-gray-500 mt-2">
            Your quiz result has been saved successfully.
          </p>

          {/* Score */}
          <div className="my-8">
            <h3 className="text-5xl font-bold text-violet-600">
              {percentage}%
            </h3>

            <p className="text-slate-700 mt-3 font-medium">
              You scored {score} out of {resultData?.totalQuestions}
            </p>
          </div>

          {/* Result Message */}
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 mb-6 ${
              percentage >= 70
                ? "bg-green-50 text-green-700"
                : "bg-orange-50 text-orange-700"
            }`}
          >
            <CheckCircle size={18} />

            <span className="text-sm font-medium">
              {percentage >= 70
                ? "Great job! You passed the quiz."
                : "Keep practicing! You can try again."}
            </span>
          </div>

          {/* Result Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleRetake}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition"
            >
              <RotateCcw size={18} />
              Retake Quiz
            </button>

            <button
              onClick={() => navigate("/my-courses")}
              className="px-6 py-3 rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 transition"
            >
              My Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
