"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract token and other params from Supabase's redirect URL
    const token = searchParams.get("token_hash") || searchParams.get("token") || searchParams.get("access_token");
    const email = searchParams.get("email");
    const type = searchParams.get("type") || "recovery";
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");

    // If there's an error, redirect to app with error
    if (error || errorCode) {
      const errorDescription = searchParams.get("error_description") || "This link is invalid or has expired";
      const errorMsg = decodeURIComponent(errorDescription.replace(/\+/g, " "));
      
      // Build the deep link with error params
      const errorUrl = `omniflow://set-password?error=${error}&error_code=${errorCode}&error_description=${encodeURIComponent(errorMsg)}${email ? `&email=${email}` : ""}`;
      
      console.log("Redirecting to app with error:", errorUrl);
      window.location.href = errorUrl;
      return;
    }

    // If we have a token, redirect to app with success params
    if (token) {
      let deepLink = `omniflow://set-password`;
      const params = new URLSearchParams({
        token,
        type,
      });
      
      if (email) {
        params.append("email", email);
      }
      
      deepLink += `?${params.toString()}`;
      
      console.log("Redirecting to app with token:", deepLink.substring(0, 50) + "...");
      window.location.href = deepLink;
    } else {
      // No token, redirect to login
      window.location.href = "omniflow://login";
    }
  }, [router, searchParams]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      flexDirection: "column",
      fontFamily: "system-ui",
      gap: "20px"
    }}>
      <div style={{ fontSize: "18px", color: "#666" }}>
        Redirecting to Omniflow App...
      </div>
      <div style={{ fontSize: "14px", color: "#999" }}>
        Please wait while we open the app
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column",
        fontFamily: "system-ui",
        gap: "20px"
      }}>
        <div style={{ fontSize: "18px", color: "#666" }}>
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordHandler />
    </Suspense>
  );
}

