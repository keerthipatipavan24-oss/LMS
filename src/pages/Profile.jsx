import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Edit2,
  Save,
  X,
  CalendarDays,
  MapPin,
  BookOpen,
  CheckCircle,
  Trophy,
  TrendingUp,
} from "lucide-react";

import defaultCourses from "../data/courses";

// Initial Profile
const initialProfile = {
  name: "Student Name",
  email: "student@example.com",
  phone: "",
  dob: "",
  gender: "",
  location: "",
  about: "",
};

// Common Input Styling
const inputClass =
  "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-700 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition";

// Reusable Form Field - Outside Profile Component
const FormField = ({ label, name, icon: Icon, error, children }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
        {Icon && <Icon size={15} className="text-violet-600" />}
        {label}
      </label>

      {children}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
};

// Reusable Profile Information Item
const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="w-9 h-9 shrink-0 rounded-lg bg-violet-50 flex items-center justify-center">
        <Icon size={18} className="text-violet-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>

        <p className="text-sm font-medium text-slate-800 mt-1 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
};

// Main Profile Component
const Profile = () => {
  // Profile Information
  const [profile, setProfile] = useState(() => {
    try {
      return {
        ...initialProfile,
        ...JSON.parse(localStorage.getItem("studentProfile") || "{}"),
      };
    } catch {
      return initialProfile;
    }
  });

  const [formData, setFormData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // Learning Statistics
  const [learningStats] = useState(() => {
    try {
      const savedCourses = localStorage.getItem("courses");

      const courses = savedCourses ? JSON.parse(savedCourses) : defaultCourses;

      const enrolledCourses = JSON.parse(
        localStorage.getItem("enrolledCourses") || "[]",
      );

      const myCourses = courses.filter((course) =>
        enrolledCourses.includes(course.id),
      );

      let totalLessons = 0;
      let completedLessons = 0;

      myCourses.forEach((course) => {
        const lessons = (course.lessonList || []).slice(0, 5);

        totalLessons += lessons.length;

        const savedCompleted = JSON.parse(
          localStorage.getItem(`completedLessons_${course.id}`) || "[]",
        );

        const validCompleted = Array.isArray(savedCompleted)
          ? new Set(
              savedCompleted.filter(
                (index) =>
                  Number.isInteger(index) &&
                  index >= 0 &&
                  index < lessons.length,
              ),
            )
          : new Set();

        completedLessons += validCompleted.size;
      });

      const allResults = JSON.parse(
        localStorage.getItem("quizResults") || "[]",
      );

      const quizAttempts = Array.isArray(allResults)
        ? allResults.filter((result) =>
            enrolledCourses.includes(result.courseId),
          ).length
        : 0;

      return {
        enrolledCourses: myCourses.length,
        totalLessons,
        completedLessons,
        quizAttempts,
        progress:
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0,
      };
    } catch {
      return {
        enrolledCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        quizAttempts: 0,
        progress: 0,
      };
    }
  });

  // Open Edit Modal
  const handleEdit = () => {
    setFormData({ ...profile });
    setErrors({});
    setIsEditing(true);
  };

  // Close Edit Modal
  const handleClose = () => {
    setFormData({ ...profile });
    setErrors({});
    setIsEditing(false);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.phone.trim()) {
      const digits = formData.phone.replace(/\D/g, "");

      if (digits.length < 10 || digits.length > 15) {
        newErrors.phone = "Enter a valid phone number.";
      }
    }

    if (formData.dob) {
      const selectedDate = new Date(`${formData.dob}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future.";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Save Profile
  const handleSave = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedProfile = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      about: formData.about.trim(),
    };

    localStorage.setItem("studentProfile", JSON.stringify(updatedProfile));

    setProfile(updatedProfile);
    setIsEditing(false);
    setErrors({});
  };

  // Statistics
  const stats = [
    {
      title: "Enrolled",
      value: learningStats.enrolledCourses,
      icon: BookOpen,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      title: "Lessons Done",
      value: learningStats.completedLessons,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Quizzes",
      value: learningStats.quizAttempts,
      icon: Trophy,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">
          Account Settings
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          Manage your personal information and learning activity.
        </p>
      </div>

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center">
              <span className="text-4xl font-bold text-violet-700">
                {profile.name.trim().charAt(0).toUpperCase() || "S"}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-4">
              {profile.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1 break-all">
              {profile.email}
            </p>

            <span className="inline-flex items-center gap-2 mt-4 bg-violet-50 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full">
              <GraduationCap size={15} />
              Student Account
            </span>
          </div>

          <div className="border-t border-gray-100 my-6" />

          {/* Quick Statistics */}
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.title} className="text-center min-w-0">
                  <div
                    className={`${stat.bg} w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2`}
                  >
                    <Icon size={18} className={stat.color} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">
                    {stat.value}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="w-full mt-7 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition"
          >
            <Edit2 size={17} />
            Edit Profile
          </button>
        </div>

        {/* Right Personal Information */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 md:p-7 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h2 className="text-xl font-bold text-slate-800">
              Personal Information
            </h2>

            <User size={23} className="text-violet-600" />
          </div>

          <p className="text-sm text-gray-500 mb-7">
            Your details are saved on this device.
          </p>

          <div className="space-y-6">
            <InfoItem icon={User} label="Full Name" value={profile.name} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={Mail}
                label="Email Address"
                value={profile.email}
              />

              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={profile.phone}
              />

              <InfoItem
                icon={CalendarDays}
                label="Date of Birth"
                value={profile.dob}
              />

              <InfoItem
                icon={GraduationCap}
                label="Gender"
                value={profile.gender}
              />

              <InfoItem
                icon={MapPin}
                label="Location"
                value={profile.location}
              />
            </div>

            {/* About Me */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                About Me
              </h3>

              <p className="text-sm text-gray-500 leading-6 whitespace-pre-wrap">
                {profile.about || "Add a short introduction about yourself."}
              </p>
            </div>
          </div>

          {/* Saved Status */}
          <div className="flex items-center gap-2 text-green-600 text-xs mt-7 pt-5 border-t border-gray-100">
            <CheckCircle size={16} />
            Profile information saved on this device
          </div>
        </div>
      </div>

      {/* Edit Profile Popup */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 sm:px-7 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Profile
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update your personal information.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                aria-label="Close edit profile"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} noValidate className="p-5 sm:p-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <FormField
                  label="Full Name"
                  name="name"
                  icon={User}
                  error={errors.name}
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </FormField>

                {/* Email */}
                <FormField
                  label="Email Address"
                  name="email"
                  icon={Mail}
                  error={errors.email}
                >
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </FormField>

                {/* Phone */}
                <FormField
                  label="Phone Number"
                  name="phone"
                  icon={Phone}
                  error={errors.phone}
                >
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={inputClass}
                  />
                </FormField>

                {/* Date of Birth */}
                <FormField
                  label="Date of Birth"
                  name="dob"
                  icon={CalendarDays}
                  error={errors.dob}
                >
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date().toLocaleDateString("en-CA")}
                    className={inputClass}
                  />
                </FormField>

                {/* Gender */}
                <FormField
                  label="Gender"
                  name="gender"
                  icon={GraduationCap}
                  error={errors.gender}
                >
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </FormField>

                {/* Location */}
                <FormField
                  label="Location"
                  name="location"
                  icon={MapPin}
                  error={errors.location}
                >
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                    className={inputClass}
                  />
                </FormField>

                {/* About Me */}
                <div className="sm:col-span-2">
                  <FormField label="About Me" name="about" error={errors.about}>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Write a short introduction about yourself..."
                      rows={4}
                      maxLength={300}
                      className={`${inputClass} resize-none`}
                    />

                    <p className="text-xs text-gray-400 text-right mt-1">
                      {formData.about.length}/300 characters
                    </p>
                  </FormField>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-50 transition"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
