import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImages from "./pages/GenerateImages";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (percentage < 100) {
      const timer = setTimeout(() => setPercentage(percentage + 1), 15);
      if (percentage === 99) setLoading(false);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative flex justify-center items-center">
          <div className="animate-spin rounded-full max-sm:h-20 max-sm:w-20 h-32 w-32 border-4 border-purple-500 border-t-transparent"></div>
          <div className="absolute text-purple-600 font-semibold text-lg select-none">
            {percentage}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
