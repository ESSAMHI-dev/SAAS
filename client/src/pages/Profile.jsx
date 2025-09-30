import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch profile
  useEffect(() => {
    if (!token){
      navigate("/", { replace: true });
      return;
    };
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const user = res.data.user;
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            imageUrl: user.imageUrl || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Upload image
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const form = new FormData();
      form.append("image", file);
      const res = await axios.post("/api/user/upload-image", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success)
        setFormData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put("/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      setLoading(true);
      await axios.delete("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setError("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <ArrowLeft
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 cursor-pointer"
        />
        <div className="relative items-center">
          <img
            src={formData.imageUrl || "/unknown.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 left-55 max-sm:left-31 max-sm:bottom-1 bg-gray-800 text-white p-1 rounded-full cursor-pointer"
          >
            <Edit2 className="w-4 h-4 cursor-pointer" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <h2 className="text-2xl font-bold">{formData.username}</h2>

        <div className="space-y-2 text-left mb-4">
          <div>
            <strong>First Name:</strong> {formData.firstName}
          </div>
          <div>
            <strong>Last Name:</strong> {formData.lastName}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white py-2 rounded-full cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 rounded-full cursor-pointer"
          >
            Delete Account
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.replace("/signin"); // clears history + refreshes
            }}
            className="bg-gray-300 text-black py-2 rounded-full cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-xl">
            <h3 className="text-xl mb-4">Edit Profile</h3>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 mb-2 border rounded"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-2 mb-2 border rounded"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-2 border rounded"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
