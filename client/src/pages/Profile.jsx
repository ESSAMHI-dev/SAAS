import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const { getToken } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    imageUrl: "",
  });

  const [plan, setPlan] = useState("basic");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        imageUrl: user.imageUrl || "",
      });

      // Fetch subscription plan from backend
      fetch("/api/user/profile", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setPlan(data.privateMetadata?.plan || "basic");
        });
    }
  }, [user]);

  const handleUpdate = async () => {
    const res = await axios.put("/api/user/profile", {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });

    if (res.ok) {
      setIsEditing(false);
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmed) return;

    const res = await fetch("/api/user/profile", {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      signOut();
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <img
          src={formData.imageUrl || "https://www.gravatar.com/avatar?d=mp"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold">{user.fullName}</h2>
        <p className="text-gray-500 mb-2 capitalize">Plan: {plan}</p>

        <div className="text-left mt-6 space-y-2">
          <div>
            <strong>First Name:</strong> {formData.firstName}
          </div>
          <div>
            <strong>Last Name:</strong> {formData.lastName}
          </div>
          <div>
            <strong>Username:</strong> {formData.username}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Edit Profile
          </button>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Delete Account
          </button>

          <button
            onClick={() => signOut()}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-10 w-full max-w-xl">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <div className="flex flex-wrap">
              <label>First Name</label>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded mb-2"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-wrap">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded mb-2"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-wrap">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded mb-2"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div className="flex flex-wrap">
              <label>Image</label>
              <input
                type="text"
                placeholder="Image URL"
                className="w-full p-2 border rounded mb-4"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
