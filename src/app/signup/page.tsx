"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "../../lib/cognitoConfig";
import Image from "next/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const router = useRouter();

  const signUpUser = (username: string, password: string, email: string) => {
    const attributeList = [];

    const emailAttribute = new CognitoUserAttribute({
      Name: "email",
      Value: email,
    });

    attributeList.push(emailAttribute);

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        setMessage(`Signup failed: ${err.message || "Unknown error"}`);
        return;
      }

      console.log("User successfully signed up:", result);
      setMessage("Signup successful! Redirecting to Verification...");
      router.push(`/verify`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    signUpUser(username, password, email);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Left Form Section */}
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full p-6 sm:p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold text-green-700">Sign Up</h1>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Create a new account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg pr-20 focus:outline-none focus:ring-2 focus:ring-green-400 "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 text-sm font-semibold hover:text-green-800 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-sm text-gray-600 mt-2">
              <p className="font-semibold mb-1">Password must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be at least 8 characters long</li>
                <li>Contain both letters and numbers</li>
                <li>Include lowercase and uppercase letters</li>
                <li>Contain at least one special character (e.g. @, #, !)</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              Sign Up
            </button>

            {message && (
              <p className="mt-2 text-sm font-bold text-center text-red-600">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative h-64 md:h-auto">
        <Image
          src="/images/loginImage.png"
          alt="Sign Up Visual"
          fill
          priority
        />
      </div>
    </div>
  );
}
