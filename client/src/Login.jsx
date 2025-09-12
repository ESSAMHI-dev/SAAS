// LoginForm.jsx
import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";

export default function LoginForm() {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      window.location.href = "/";
    } catch (err) {
      setErrorMsg(err.errors[0]?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Left Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto">
          <img
            src="@/public/leftimage.png"
            alt="Login Visual"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Or continue with</p>
            <button
              onClick={() => signIn.authenticateWithRedirect({ strategy: "oauth_google" })}
              className="mt-2 w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition"
            >
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
