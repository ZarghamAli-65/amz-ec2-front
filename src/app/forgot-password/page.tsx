"use client";

import { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../lib/cognitoConfig";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.forgotPassword({
      onSuccess: (result) => {
        console.log("Password reset initiated:", result);
        setMessage("Password reset code sent. Check your email.");
        router.push("/confirm");
      },
      onFailure: (err) => {
        console.error(
          "Error initiating password reset:",
          err.message || JSON.stringify(err)
        );
        setMessage(`Reset failed: ${err.message || "Unknown error"}`);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Forgot Password
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email or username to receive a reset code
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer font-semibold"
          >
            Send Reset Code
          </button>

          {message && (
            <p className="mt-2 text-sm text-center text-red-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
