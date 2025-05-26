import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { DocumentUpload } from "../components/DocumentUpload";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Make sure this is imported
import { Calendar } from "../components/Icons";
import { register } from "../services/AuthService";

export default function RegisterPage() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    // Patient-specific
    location: "",
    // Doctor-specific
    file_attachment: null as File | null,
  });
  
  // Handle date separately to avoid type issues
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file_attachment: e.target.files![0] }));
      
      // Clear error when a file is selected
      if (errors.file_attachment) {
        setErrors((prev) => ({ ...prev, file_attachment: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate common fields
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = "Passwords don't match";
    
    if (!formData.phone_number) newErrors.phone_number = "Phone number is required";
    
    // Validate date of birth
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    
    // Validate tab-specific fields
    if (activeTab === "patient" && !formData.location.trim()) 
      newErrors.location = "Location is required";
    
    if (activeTab === "doctor" && !formData.file_attachment) 
      newErrors.file_attachment = "Medical license/credentials are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("email", formData.email);
      apiFormData.append("password", formData.password);
      apiFormData.append("role", activeTab === "doctor" ? "pending_doctor" : "patient");
      apiFormData.append("phone_number", formData.phone_number);
      
      // Add date of birth
      if (dateOfBirth) {
        apiFormData.append("date_of_birth", dateOfBirth.toISOString().split('T')[0]);
      }
      
      if (activeTab === "patient") {
        apiFormData.append("location", formData.location);
      }
      
      if (activeTab === "doctor" && formData.file_attachment) {
        apiFormData.append("file_attachment", formData.file_attachment);
      }

      // Send to backend - make sure to send the FormData properly
    //   const response = await axios.post("http://localhost:3001/register", { body: apiFormData
    //   });

    if (activeTab === "doctor") {
      // const response = await registerDoctor(apiFormData);
      // if (response.data) {
      //   toast.success("Registration submitted! An admin will review your application.");
      //   nav("/");
      // }
    }
    else if (activeTab === "patient") {
      const response = await register(apiFormData);

      if (response.data) {
        toast.success("Registration successful! You can now log in.");
        nav("/");
      }
    
    }
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-sky-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-sky-600 mb-6">
          Create Your Account
        </h1>

        {/* Tab selector */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === "patient"
                ? "text-sky-500 border-b-2 border-sky-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("patient")}
            type="button"
          >
            Register as Patient
          </button>
          <button
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === "doctor"
                ? "text-sky-500 border-b-2 border-sky-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("doctor")}
            type="button"
          >
            Register as Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common fields */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Tommy Tommy"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="tommy@gmail.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.phone_number ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="+62 1234-5678-91"
            />
            {errors.phone_number && (
              <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>
            )}
          </div>

          {/* Date of Birth field - fixed implementation */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <div className="relative">
              <DatePicker
                selected={dateOfBirth}
                onChange={(date: Date | null) => {
                  setDateOfBirth(date);
                  if (date) {
                    // Clear error when date is selected
                    if (errors.dateOfBirth) {
                      setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                    }
                  }
                }}
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()} // Can't select future dates
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholderText="Select your date of birth"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-sky-500">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Conditional fields based on active tab */}
          {activeTab === "patient" && (
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="Jakarta, Jakarta Barat, Palmerah"
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-600">{errors.location}</p>
              )}
            </div>
          )}

          {activeTab === "doctor" && (
            <div>
              <label
                htmlFor="file_attachment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Medical License
              </label>
              <div
                className={`border-2 border-dashed rounded-md p-4 text-center ${
                  errors.file_attachment
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  id="file_attachment"
                  name="file_attachment"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file_attachment"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <DocumentUpload className="h-8 w-8 text-sky-500 mb-2" />
                  <span className="text-sm font-medium text-sky-500">
                    Click to upload
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, JPG, PNG (Max 5MB)
                  </span>
                </label>
                {formData.file_attachment && (
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: {formData.file_attachment.name}
                  </div>
                )}
              </div>
              {errors.file_attachment && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.file_attachment}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Note: Your application will be reviewed by an administrator before
                you can practice as a doctor on our platform.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 rounded-md font-medium text-white bg-sky-500 hover:bg-sky-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Processing..."
              : activeTab === "doctor"
              ? "Submit Application"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => nav("/")}
            className="text-sky-500 hover:text-sky-400 font-medium"
            type="button"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}