import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { X } from "lucide-react";
import { useAuth } from "../context/authContext";

const Hero = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const user = useAuth();

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  return (
    <div
      className={`mt-8 sm:mt-0 px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen ${
        showPopup ? "overflow-hidden h-screen" : ""
      }`}
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create amazing content <br />
          with<span className="text-primary"> AI tools</span>
        </h1>
        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        {user ? (
          <button
            onClick={() => navigate("/ai")}
            className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer"
          >
            Start creating now
          </button>
        ) : (
          <Link to={"/signin"}>
            <button className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer">
              Start creating now
            </button>
          </Link>
        )}

        <button
          onClick={togglePopup}
          className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer"
        >
          Watch Demo
        </button>
      </div>

      <div className="flex items-center gap-4 mt-5 mx-auto text-gray-600">
        <img src={assets.user_group} alt="" className="h-8" /> Trusted by 1k+
        people
      </div>

      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-4xl relative shadow-lg">
            <button
              onClick={togglePopup}
              className="absolute top-1 left-1 bg-gray-800 text-white px-1.5 py-1.5 rounded-full z-50 cursor-pointer"
            >
              <X />
            </button>
            <video
              src="/demo video.mp4"
              controls
              autoPlay
              className="w-full h-auto max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
