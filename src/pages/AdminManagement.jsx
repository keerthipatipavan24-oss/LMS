import { useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  BookOpen,
  Layers,
  LayoutGrid,
  Star,
  ClipboardList,
} from "lucide-react";

import coursesData from "../data/courses";
import Toast from "../components/Toast";

const createEmptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctOption: "",
});

const initialForm = {
  title: "",
  category: "Web Development",
  instructor: "",
  level: "Beginner",
  rating: "",
  duration: "",
  image: "",
  description: "",
  lessonTitles: "",
  lessonNotes: "",
  quizQuestions: Array.from({ length: 5 }, createEmptyQuestion),
};

export default function AdminManagement() {
  const [courses, setCourses] = useState(() => {
    try {
      const savedCourses = localStorage.getItem("courses");
      return savedCourses ? JSON.parse(savedCourses) : coursesData;
    } catch {
      return coursesData;
    }
  });

  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  // Dashboard statistics
  const totalCourses = courses.length;

  const totalLessons = courses.reduce(
    (total, course) =>
      total + (course.lessonList?.length || course.lessons || 0),
    0,
  );

  const totalCategories = new Set(
    courses.map((course) => course.category).filter(Boolean),
  ).size;

  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      description: "Available courses",
      icon: BookOpen,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      title: "Total Lessons",
      value: totalLessons,
      description: "Across all courses",
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Course Categories",
      value: totalCategories,
      description: "Categories in use",
      icon: LayoutGrid,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  // Update courses and LocalStorage
  const updateCourses = (updatedCourses) => {
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Handle normal form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Update quiz question
  const handleQuestionChange = (questionIndex, value) => {
    setFormData((previous) => {
      const updatedQuestions = [...previous.quizQuestions];

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        question: value,
      };

      return {
        ...previous,
        quizQuestions: updatedQuestions,
      };
    });
  };

  // Update quiz option
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData((previous) => {
      const updatedQuestions = [...previous.quizQuestions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];

      updatedOptions[optionIndex] = value;

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };

      return {
        ...previous,
        quizQuestions: updatedQuestions,
      };
    });
  };

  // Update correct answer
  const handleCorrectAnswerChange = (questionIndex, value) => {
    setFormData((previous) => {
      const updatedQuestions = [...previous.quizQuestions];

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        correctOption: value,
      };

      return {
        ...previous,
        quizQuestions: updatedQuestions,
      };
    });
  };

  // Open Add Course Modal
  const handleAdd = () => {
    setFormData({
      ...initialForm,
      quizQuestions: Array.from({ length: 5 }, createEmptyQuestion),
    });

    setEditId(null);
    setShowForm(true);
  };

  // Close Modal
  const handleCloseForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(initialForm);
  };

  // Add or Update Course
  const handleSubmit = (e) => {
    e.preventDefault();

    const lessonList = formData.lessonTitles
      .split("\n")
      .map((lesson) => lesson.trim())
      .filter(Boolean);

    const lessonNotes = formData.lessonNotes
      .split("\n")
      .map((note) => note.trim())
      .filter(Boolean);

    if (lessonList.length !== 5) {
      showToast("Please add exactly 5 lesson titles.", "error");
      return;
    }

    if (lessonNotes.length !== 5) {
      showToast("Please add exactly 5 lesson notes.", "error");
      return;
    }

    if (
      !formData.rating ||
      Number(formData.rating) < 0 ||
      Number(formData.rating) > 5
    ) {
      showToast("Please enter a rating between 0 and 5.", "error");
      return;
    }

    // Validate quiz questions
    const hasAnyQuizInput = formData.quizQuestions.some(
      (item) =>
        item.question.trim() ||
        item.options.some((option) => option.trim()) ||
        item.correctOption !== "",
    );

    const isExistingCourseWithoutCustomQuiz =
      editId !== null &&
      !courses.find((course) => String(course.id) === String(editId))
        ?.quizQuestions?.length;

    let quizQuestions = [];

    if (hasAnyQuizInput || !isExistingCourseWithoutCustomQuiz) {
      if (formData.quizQuestions.length !== 5) {
        showToast("Please add exactly 5 quiz questions.", "error");
        return;
      }

      const incompleteQuestion = formData.quizQuestions.some(
        (item) =>
          !item.question.trim() ||
          item.options.length !== 4 ||
          item.options.some((option) => !option.trim()) ||
          item.correctOption === "",
      );

      if (incompleteQuestion) {
        showToast(
          "Complete all 5 questions, their 4 options and correct answers.",
          "error",
        );
        return;
      }

      quizQuestions = formData.quizQuestions.map((item) => ({
        question: item.question.trim(),
        options: item.options.map((option) => option.trim()),
        answer: item.options[Number(item.correctOption)].trim(),
      }));
    }

    const courseData = {
      title: formData.title.trim(),
      category: formData.category,
      instructor: formData.instructor.trim(),
      level: formData.level,
      rating: Number(formData.rating),
      duration: formData.duration.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      lessons: 5,
      lessonList,
      lessonNotes,
    };

    if (quizQuestions.length === 5) {
      courseData.quizQuestions = quizQuestions;
    }

    if (editId !== null) {
      const updatedCourses = courses.map((course) =>
        String(course.id) === String(editId)
          ? {
              ...course,
              ...courseData,
            }
          : course,
      );

      updateCourses(updatedCourses);
      showToast("Course updated successfully!");
    } else {
      const newId =
        courses.length > 0
          ? Math.max(...courses.map((course) => Number(course.id) || 0)) + 1
          : 1;

      const newCourse = {
        id: newId,
        ...courseData,
      };

      updateCourses([...courses, newCourse]);
      showToast("Course added successfully!");
    }

    handleCloseForm();
  };

  // Open Edit Modal
  const handleEdit = (course) => {
    setEditId(course.id);

    const existingQuiz = course.quizQuestions || [];

    const quizQuestions = Array.from({ length: 5 }, (_, index) => {
      const item = existingQuiz[index];

      if (!item) {
        return createEmptyQuestion();
      }

      const options = Array.isArray(item.options)
        ? item.options.slice(0, 4)
        : ["", "", "", ""];

      while (options.length < 4) {
        options.push("");
      }

      const correctOption = options.findIndex(
        (option) => option === item.answer,
      );

      return {
        question: item.question || "",
        options,
        correctOption: correctOption >= 0 ? String(correctOption) : "",
      };
    });

    setFormData({
      title: course.title || "",
      category: course.category || "Web Development",
      instructor: course.instructor || "",
      level: course.level || "Beginner",
      rating: course.rating ?? "",
      duration: course.duration || "",
      image: course.image || "",
      description: course.description || "",
      lessonTitles: (course.lessonList || []).join("\n"),
      lessonNotes: (course.lessonNotes || []).join("\n"),
      quizQuestions,
    });

    setShowForm(true);
  };

  // Delete Course
  const handleDelete = () => {
    const updatedCourses = courses.filter(
      (course) => String(course.id) !== String(deleteId),
    );

    updateCourses(updatedCourses);
    setDeleteId(null);

    showToast("Course deleted successfully!");
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition";

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Course Management
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Add, edit and manage your courses.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Add New Course
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>

                <h2 className="text-2xl font-bold text-slate-800 mt-2">
                  {stat.value}
                </h2>

                <p className="text-gray-400 text-xs mt-1">{stat.description}</p>
              </div>

              <div className={`${stat.bg} p-3 rounded-xl`}>
                <Icon size={26} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Course List Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">All Courses</h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage your available learning programmes.
        </p>
      </div>

      {/* Course List Table */}
      {courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
          <BookOpen size={40} className="text-gray-400 mx-auto mb-3" />

          <h3 className="text-lg font-semibold text-slate-800">
            No courses available
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Add your first course to get started.
          </p>

          <button
            onClick={handleAdd}
            className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg transition"
          >
            Add Course
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Course",
                    "Instructor",
                    "Category",
                    "Level",
                    "Lessons",
                    "Rating",
                    "Duration",
                    "Quiz",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-4 text-xs font-semibold text-gray-500 uppercase ${
                        heading === "Actions" ? "text-center" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-violet-50/30 transition"
                  >
                    {/* Course */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[210px]">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {course.title}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            ID: {course.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.instructor || "Not assigned"}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex bg-violet-50 text-violet-700 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                        {course.category}
                      </span>
                    </td>

                    {/* Level */}
                    <td className="px-5 py-4">
                      <span className="inline-flex bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                        {course.level}
                      </span>
                    </td>

                    {/* Lessons */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.lessonList?.length || course.lessons || 0}
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        {course.rating || "N/A"}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {course.duration || "N/A"}
                    </td>

                    {/* Quiz */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.quizQuestions?.length || 0} / 5
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          title="Edit Course"
                          className="p-2 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => setDeleteId(course.id)}
                          title="Delete Course"
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"}
            </p>
          </div>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {editId !== null ? "Edit Course" : "Add New Course"}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Enter the course information below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-slate-800 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5">
              {/* Course Title */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Course Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course name"
                  className={inputClass}
                  required
                />
              </div>

              {/* Category and Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Web Development</option>
                    <option>Programming</option>
                    <option>Data Science</option>
                    <option>Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Level
                  </label>

                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              {/* Instructor and Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Instructor
                  </label>

                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    placeholder="Enter instructor name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Rating (0–5)
                  </label>

                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="4.5"
                    min="0"
                    max="5"
                    step="0.1"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 5 Weeks"
                  className={inputClass}
                  required
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Course Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className={inputClass}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  rows="3"
                  className={inputClass}
                  required
                />
              </div>

              {/* Lesson Titles */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Lesson Titles (Exactly 5, one per line)
                </label>

                <textarea
                  name="lessonTitles"
                  value={formData.lessonTitles}
                  onChange={handleChange}
                  placeholder={
                    "Introduction to Full Stack Development\nBuilding the Frontend with React\nBackend Development with Node.js\nDatabase Integration with MongoDB\nFull Stack Application Project"
                  }
                  rows="6"
                  className={inputClass}
                  required
                />

                <p className="text-xs text-gray-400 mt-2">
                  Enter exactly five lesson titles in order.
                </p>
              </div>

              {/* Lesson Notes */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Lesson Notes (Exactly 5, one per line)
                </label>

                <textarea
                  name="lessonNotes"
                  value={formData.lessonNotes}
                  onChange={handleChange}
                  placeholder={
                    "Understand frontend, backend and database concepts.\nLearn React components, JSX, props and state.\nCreate Express routes and REST API endpoints.\nConnect MongoDB and perform CRUD operations.\nBuild and test a complete full-stack application."
                  }
                  rows="8"
                  className={inputClass}
                  required
                />

                <p className="text-xs text-gray-400 mt-2">
                  Note 1 belongs to Lesson 1, Note 2 belongs to Lesson 2, and so
                  on.
                </p>
              </div>

              {/* Quiz Questions Section */}
              <div className="border border-violet-200 rounded-xl p-4 sm:p-5 bg-violet-50/40 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="bg-violet-100 p-2.5 rounded-lg">
                    <ClipboardList size={22} className="text-violet-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Course Quiz Questions
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Add exactly 5 questions with 4 options each.
                    </p>
                  </div>
                </div>

                {formData.quizQuestions.map((item, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="bg-white border border-gray-200 rounded-xl p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-800">
                        Question {questionIndex + 1}
                      </h4>

                      <span className="text-xs text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
                        4 Options
                      </span>
                    </div>

                    {/* Question */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Question
                      </label>

                      <textarea
                        value={item.question}
                        onChange={(e) =>
                          handleQuestionChange(questionIndex, e.target.value)
                        }
                        placeholder={`Enter question ${questionIndex + 1}`}
                        rows="2"
                        className={inputClass}
                      />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <label className="block text-sm text-gray-600 mb-2">
                            Option {String.fromCharCode(65 + optionIndex)}
                          </label>

                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Enter option ${String.fromCharCode(
                              65 + optionIndex,
                            )}`}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Correct Answer
                      </label>

                      <select
                        value={item.correctOption}
                        onChange={(e) =>
                          handleCorrectAnswerChange(
                            questionIndex,
                            e.target.value,
                          )
                        }
                        className={inputClass}
                      >
                        <option value="">Select correct answer</option>

                        {item.options.map((option, optionIndex) => (
                          <option
                            key={optionIndex}
                            value={optionIndex}
                            disabled={!option.trim()}
                          >
                            Option {String.fromCharCode(65 + optionIndex)}
                            {option.trim() ? ` - ${option}` : " - Empty"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                <p className="text-xs text-gray-500">
                  All five questions, all four options and one correct answer
                  for each question are required when adding a new course.
                </p>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition"
                >
                  {editId !== null ? "Update Course" : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Delete Course
              </h2>

              <button
                onClick={() => setDeleteId(null)}
                className="text-gray-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-slate-700 text-sm transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
