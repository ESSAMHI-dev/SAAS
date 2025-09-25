import { useState } from "react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users,
  LogOut,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user & logout from context

  if (!user) return null; // Not logged in

  const handleSignOut = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between z-50
      items-center max-sm:absolute top-14 bottom-0 max-sm:w-full
      ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all 
      duration-300 ease-in-out`}
    >
      {/* Top section */}
      <div className="my-7 w-full text-center">
        <img
          src={user.imageUrl || "/unknown.jpg"}
          alt="User Avatar"
          className="w-13 h-14 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center font-medium">{user.firstName}</h1>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                  isActive
                    ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                    : "hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <Link to={"/profile"}>
          <div className="flex gap-2 items-center cursor-pointer">
            <img
              src={user.imageUrl || "/unknown.jpg"}
              className="w-8 h-9 rounded-full"
              alt="User Avatar"
            />
            <div>
              <h1 className="text-xs font-medium">
                {user.firstName} {user.lastName}
              </h1>
            </div>
          </div>
        </Link>
        <LogOut
          onClick={handleSignOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 cursor-pointer transition"
        />
      </div>
    </div>
  );
};

export default Sidebar;
