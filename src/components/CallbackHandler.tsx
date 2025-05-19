"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    if (error) {
      router.push(
        `/signin?error=${encodeURIComponent(errorDescription || error)}`
      );
      return;
    }

    if (!code) return;

    const exchangeCodeForToken = async () => {
      try {
        const res = await fetch(
          "https://zargham-domain.auth.us-east-1.amazoncognito.com/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
              code,
              redirect_uri:
                process.env.NODE_ENV === "development"
                  ? "http://localhost:3000/auth/callback"
                  : "https://amz-aws-signup-in.vercel.app/auth/callback",
            }),
          }
        );

        const data = await res.json();
        console.log("Data :", data);

        if (res.ok && data.id_token) {
          const decodedToken = JSON.parse(atob(data.id_token.split(".")[1]));

          let providerName = "Cognito";
          if (decodedToken.identities && decodedToken.identities.length > 0) {
            providerName = decodedToken.identities[0].providerName;
          }

          localStorage.setItem("id_token", data.id_token);
          localStorage.setItem("provider", providerName);

          router.push("/");
        } else {
          console.error("Token exchange failed:", data);
        }
      } catch (err) {
        console.error("Token exchange error:", err);
      }
    };

    exchangeCodeForToken();
  }, [code, error, errorDescription, router]);

  return <p className="text-center p-4">Logging in...</p>;
}
