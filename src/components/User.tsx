"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  const [name, setName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const idToken = localStorage.getItem("id_token");
    const providerFromStorage = localStorage.getItem("provider");

    console.log("Id Token :", idToken);
    console.log("Provider :", providerFromStorage);

    if (!idToken) {
      router.push("/signin");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(idToken.split(".")[1]));

      setEmail(decodedToken.email || "Unknown User");
      setName(decodedToken.name || decodedToken.given_name || "User");
      setProvider(providerFromStorage || "Unknown");

      setLoading(false);
    } catch (error) {
      console.error("Token decoding failed", error);
      localStorage.removeItem("id_token");
      router.push("/signin");
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("provider");
    router.push("/signin");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-4">
          Welcome {name}{" "}
          <span className="text-gray-600">({provider} Account)</span>!
        </h1>

        <p className="text-lg sm:text-xl font-medium text-gray-700 mb-6">
          Email: <span className="font-semibold text-blue-600">{email}</span>
        </p>

        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-semibold transition duration-200 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
