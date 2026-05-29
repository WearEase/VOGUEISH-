import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const buyerSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn("buyer-signin", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        router.push("/shop");
        return { success: true };
      }
      
      return { success: false, error: "Sign in failed" };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sellerSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn("seller-signin", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        router.push("/seller-dashboard");
        return { success: true };
      }
      
      return { success: false, error: "Sign in failed" };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const buyerSignUp = async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{
    success: boolean;
    error?: string;
    requiresEmailVerification?: boolean;
    message?: string;
    emailSent?: boolean;
    emailSendReason?: string;
  }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/buyer/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Sign up failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return {
        success: true,
        requiresEmailVerification: !!data.requiresEmailVerification,
        message: data.message || "Account created",
        emailSent: data.emailSent,
        emailSendReason: data.emailSendReason,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Sign up failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const buyerGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google-buyer", { callbackUrl: "/shop" });
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sellerGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google-seller", { callbackUrl: "/seller-dashboard" });
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationLink = async (email: string, role?: "buyer" | "seller") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || "Failed to send verification link";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, message: data.message as string };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send verification link";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordResetLink = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || "Failed to send reset link";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, message: data.message as string };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset link";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (payload: {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || "Failed to reset password";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, message: data.message as string };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || "Failed to send OTP";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, message: data.message as string };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sellerSignUpStep1 = async (userData: {
    email: string;
    phone: string;
    gst: string;
    otp: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/seller/signup/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Step 1 failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, tempToken: data.tempToken };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Step 1 failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sellerSignUpStep2 = async (userData: {
    businessName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    tempToken: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/seller/signup/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Step 2 failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, step3Token: data.step3Token };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Step 2 failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sellerSignUpStep3 = async (userData: {
    password: string;
    confirmPassword: string;
    step3Token: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/seller/signup/step3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Registration failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    // Session data
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading" || isLoading,
    error,
    clearError,
    
    // User role helpers
    isBuyer: session?.user?.role === "buyer",
    isSeller: session?.user?.role === "seller",
    
    // Auth methods
    buyerSignIn,
    sellerSignIn,
    buyerGoogleSignIn,
    sellerGoogleSignIn,
    buyerSignUp,
    sendVerificationLink,
    sendPasswordResetLink,
    resetPassword,
    sendOTP,
    sellerStep1: sellerSignUpStep1,
    sellerStep2: sellerSignUpStep2,
    sellerStep3: sellerSignUpStep3,
    sellerSignUpStep1,
    sellerSignUpStep2,
    sellerSignUpStep3,
    logout,
  };
}