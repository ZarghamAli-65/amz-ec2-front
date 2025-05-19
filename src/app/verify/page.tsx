"use client";

import { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../lib/cognitoConfig";
import { useRouter } from "next/navigation";

export default function ConfirmPage() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        setMessage(`Confirmation failed: ${err.message || "Unknown error"}`);
        return;
      }

      console.log("User confirmed successfully:", result);
      setMessage("Account confirmed successfully! Redirecting to Sign In.");
      router.push(`/signin`);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-purple-700">
            Confirm Account
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Please enter your username and the verification code sent to your
            email.
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-5">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification Code"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Confirm
          </button>

          {message && (
            <p className="mt-3 text-sm text-center text-red-600 font-medium">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
