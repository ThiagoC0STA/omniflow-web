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
    
    // ALWAYS try to redirect to mobile app first (deep link)
    // If the app is installed, it will open. If not, the browser will stay on web.
    // The fallback timeout (3s) will load the web page if app doesn't open
    const isMobileApp = true; // Try app first for all mobile devices

    // If there's an error, handle differently for web vs mobile
    if (error || errorCode) {
      const errorDescription = searchParams.get("error_description") || "This link is invalid or has expired";
      const errorMsg = decodeURIComponent(errorDescription.replace(/\+/g, " "));
      
      if (isMobileApp) {
        // Build the deep link with error params for mobile app
        const errorUrl = `omniflow://set-password?error=${error}&error_code=${errorCode}&error_description=${encodeURIComponent(errorMsg)}${email ? `&email=${email}` : ""}`;
        console.log("Mobile app detected - redirecting to app with error:", errorUrl);
        window.location.href = errorUrl;
      } else {
        // For web, redirect to login page with error
        console.log("Web browser detected - redirecting to login");
        router.push("/login?error=" + encodeURIComponent(errorMsg));
      }
      return;
    }

    // If we have a token, handle web vs mobile
    if (token) {
      if (isMobileApp) {
        // Redirect to mobile app with deep link
        // NOTE: For password reset, we need to redirect to set-password screen
        const params = new URLSearchParams({
          token_hash: token,  // Use token_hash for mobile app
          type: type || 'recovery',
        });
        
        if (email) {
          params.append("email", email);
        }
        
        const deepLink = `omniflow://set-password?${params.toString()}`;
        
        console.log("Mobile app detected - redirecting to app with token:", deepLink.substring(0, 80) + "...");
        
        // Try deep link first
        window.location.href = deepLink;
        
        // Fallback: if deep link doesn't work in 3 seconds, show instructions
        setTimeout(() => {
          const fallbackUrl = `/set-password?${params.toString()}`;
          console.log("Deep link fallback - opening web page:", fallbackUrl);
          window.location.href = fallbackUrl;
        }, 3000);
      } else {
        // For web, redirect to set-password page
        const params = new URLSearchParams({
          token,
          type,
        });
        
        if (email) {
          params.append("email", email);
        }
        
        console.log("Web browser detected - redirecting to set-password page");
        router.push(`/set-password?${params.toString()}`);
      }
    } else {
      // No token, redirect based on platform
      if (isMobileApp) {
        window.location.href = "omniflow://login";
      } else {
        router.push("/login");
      }
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

