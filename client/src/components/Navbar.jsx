import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  return (
    <div
      className="fixed z-10 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4
                 sm:px-20 xl:px-32"
    >
      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate("/")}
      />

      
      {user ? (
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <h1 className="font-medium mt-1 max-sm:text-xs max-sm:mt-2">
            {user.firstName || "User"}
          </h1>
          <img
            src={user.imageUrl || "/unknown.jpg"}
            alt={user.userName || "User"}
            className="w-8 h-8 rounded-full hover:scale-95 transition-transform"
          />
        </div>
      ) : (
        <button
          onClick={() => navigate("/signin")}
          className="flex items-center gap-2 px-10 py-2.5 text-sm font-medium text-white 
                     bg-primary rounded-full hover:bg-blue-500 transition-colors max-sm:px-5 hover:cursor-pointer"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
