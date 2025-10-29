"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ResetPasswordHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showWebForm, setShowWebForm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Extract token and other params from Supabase's redirect URL
    // Supabase sends token in HASH, not query params!
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    console.log('🔍 ALL SEARCH PARAMS:', Array.from(searchParams.entries()));
    console.log('🔍 HASH PARAMS:', Array.from(hashParams.entries()));
    console.log('🔍 WINDOW LOCATION:', window.location.href);
    
    // Get from hash first (Supabase sends it here), then fallback to query params
    const token = hashParams.get("access_token") || hashParams.get("token_hash") || 
                  searchParams.get("token_hash") || searchParams.get("token");
    let email = hashParams.get("email") || searchParams.get("email");
    const type = hashParams.get("type") || searchParams.get("type") || "recovery";
    const error = hashParams.get("error") || searchParams.get("error");
    const errorCode = hashParams.get("error_code") || searchParams.get("error_code");
    
    // If email is not in params, try to extract from JWT token
    if (!email && token && token.includes('.')) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.email;
        console.log('🔍 Extracted email from token:', email);
      } catch (e) {
        console.log('🔍 Could not extract email from token');
      }
    }
    
    console.log('🔍 EXTRACTED VALUES:', { token: token?.substring(0, 20), email, type, error, errorCode });
    
    // Detect if this is likely a mobile device
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    
    // Only redirect to app if we're on a mobile device
    // Otherwise, show the web form
    const shouldRedirectToApp = isMobileDevice;

    // If there's an error, handle differently for web vs mobile
    if (error || errorCode) {
      const errorDescription = searchParams.get("error_description") || "This link is invalid or has expired";
      const errorMsg = decodeURIComponent(errorDescription.replace(/\+/g, " "));
      
      if (shouldRedirectToApp) {
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
      if (shouldRedirectToApp) {
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
        
        console.log("Mobile device detected - attempting deep link:", deepLink.substring(0, 80) + "...");
        
        // Try deep link first
        window.location.href = deepLink;
        
        // Fallback: if deep link doesn't work in 2 seconds, show web form
        setTimeout(() => {
          console.log("Deep link didn't open app, showing web form to set password");
          setShowWebForm(true);
        }, 2000);
      } else {
        // For web desktop, redirect to set-password page
        const params = new URLSearchParams({
          token,
          type,
        });
        
        if (email) {
          params.append("email", email);
        }
        
        console.log("Desktop browser detected - redirecting to set-password page");
        router.push(`/set-password?${params.toString()}`);
      }
    } else {
      // No token, redirect based on platform
      if (shouldRedirectToApp) {
        window.location.href = "omniflow://login";
      } else {
        router.push("/login");
      }
    }
  }, [router, searchParams, showWebForm]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully! Redirecting to login...' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Error setting password:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to set password.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // If showing web form
  if (showWebForm) {
    return (
      <div style={{ 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f5f5f5, #ffffff)",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "400px",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ 
            fontSize: "24px", 
            fontWeight: "bold", 
            marginBottom: "8px",
            color: "#111827"
          }}>Set Your Password</h1>
          <p style={{ 
            fontSize: "14px", 
            color: "#6b7280", 
            marginBottom: "32px" 
          }}>Create a secure password for your account</p>

          <form onSubmit={handleSetPassword}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                marginBottom: "8px",
                color: "#374151"
              }}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                marginBottom: "8px",
                color: "#374151"
              }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </div>

            {message && (
              <div style={{
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                background: message.type === 'success' ? "#d1fae5" : "#fee2e2",
                color: message.type === 'success' ? "#065f46" : "#991b1b",
                fontSize: "14px"
              }}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#9ca3af" : "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Default redirect message
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