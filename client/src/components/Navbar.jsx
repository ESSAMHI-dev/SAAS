import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div
      className="fixed z-10 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4
    sm:px-20 xl:px-32"
    >
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {user ? (
        <div onClick={()=> navigate("/profile")} className="flex flex-row gap-2 cursor-pointer">
          <h1 className="font-medium mt-1">{user.fullName}</h1>
          <img
            src={user.imageUrl}
            className="w-8 h-8 rounded-full hover:cursor-pointer hover:scale-95"
            alt=""
          />
        </div>
      ) : (
        <button
          onClick={() => navigate("/ai")}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer max-sm:px-5 bg-primary
      text-white px-10 py-2.5 hover:bg-blue-500 transition-colors "
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
