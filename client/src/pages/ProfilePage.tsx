import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useRecoilValue } from "recoil";
import { authState } from "../store/auth";
import { toast } from "react-hot-toast";

interface ProfileFormData {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const auth = useRecoilValue(authState);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      setFormData({
        name: auth.user.name || "",
        email: auth.user.email || "",
      });
    }
  }, [auth?.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate update delay
      // await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Profile information saved locally");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save profile information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    toast.success("Logged out successfully");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#040506]">
        <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Profile Information
                </h1>
                <p className="mt-1 text-gray-400">
                  Update your account details and profile information.
                </p>
              </div>
              <button
                onClick={() => {
                  if (isEditing) {
                    setFormData({
                      name: auth?.user?.name || "",
                      email: auth?.user?.email || "",
                    });
                  }
                  setIsEditing(!isEditing);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {/* Form */}
            <div className="bg-black/20 border border-gray-800 rounded-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !isEditing && "opacity-70 cursor-not-allowed"
                    }`}
                    required
                    disabled={!isEditing}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !isEditing && "opacity-70 cursor-not-allowed"
                    }`}
                    required
                    disabled={!isEditing}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-md hover:bg-red-500/20"
                  >
                    Logout
                  </button>

                  <div className="flex space-x-4">
                    {isEditing && (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
