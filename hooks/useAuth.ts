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
    } catch (error: any) {
      const errorMessage = error.message || "Sign in failed";
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
    } catch (error: any) {
      const errorMessage = error.message || "Sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const buyerSignUp = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/buyer/signup", {
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

      // Auto sign in after successful registration
      const signInResult = await buyerSignIn(userData.email, userData.password);
      return signInResult;
    } catch (error: any) {
      const errorMessage = error.message || "Sign up failed";
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
    } catch (error: any) {
      const errorMessage = error.message || "Step 1 failed";
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
    } catch (error: any) {
      const errorMessage = error.message || "Step 2 failed";
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
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed";
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
      router.push("/");
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
    buyerSignUp,
    sellerSignUpStep1,
    sellerSignUpStep2,
    sellerSignUpStep3,
    logout,
  };
}