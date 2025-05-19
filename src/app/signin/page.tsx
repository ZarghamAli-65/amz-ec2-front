"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../../lib/cognitoConfig";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("Access token:", result.getAccessToken().getJwtToken());
        setMessage("Login successful!");
        router.push("/");
      },
      onFailure: (err) => {
        setMessage(`Login failed: ${err.message || "Unknown error"}`);
      },
    });
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    const redirectUri =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/auth/callback"
        : "https://amz-aws-signup-in.vercel.app/auth/callback";
    const googleUrl = `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid+profile+email&identity_provider=Google&prompt=login`;
    router.push(googleUrl);
  };

  const handleMicrosoftLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    const redirectUri =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/auth/callback"
        : "https://amz-aws-signup-in.vercel.app/auth/callback";
    const microsoftUrl = `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid+profile+email&identity_provider=Microsoft&prompt=login`;
    router.push(microsoftUrl);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/loginImage.png"
          alt="Login Background"
          fill
          priority
        />
      </div>

      <div className="flex flex-col justify-center items-center m-auto  p-6 sm:p-10 bg-white shadow-lg rounded-4xl ">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-700">
              Welcome Back!
            </h1>
            <p className="mt-2 text-gray-600 font-medium">
              Sign in to continue with us
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-blue-600 text-sm font-semibold hover:text-blue-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <p className="mt-2 text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:underline hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </p>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>

            {message && (
              <p className="text-sm text-red-600 font-medium">{message}</p>
            )}
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-gray-500 text-sm font-semibold">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full cursor-pointer bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
            >
              Sign In with Google
            </button>
            <button
              onClick={handleMicrosoftLogin}
              className="w-full cursor-pointer bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition"
            >
              Sign In with Microsoft
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
