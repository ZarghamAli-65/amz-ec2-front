"use client";

import { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../lib/cognitoConfig";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleConfirmPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.confirmPassword(code, newPassword, {
      onSuccess: (result) => {
        console.log("Password reset successful:", result);
        setMessage("Password reset successful! You can now Sign In.");
        router.push("/signin");
      },
      onFailure: (err) => {
        console.error(
          "Error confirming new password:",
          err.message || JSON.stringify(err)
        );
        setMessage(`Reset failed: ${err.message || "Unknown error"}`);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your credentials to reset your password
        </p>

        <form onSubmit={handleConfirmPassword} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification Code"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg pr-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm cursor-pointer hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-semibold cursor-pointer"
          >
            Reset Password
          </button>

          {message && (
            <p className="mt-2 text-sm text-center text-red-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
