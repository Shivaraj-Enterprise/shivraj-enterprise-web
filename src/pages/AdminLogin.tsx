import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";


type Mode = "login" | "signup" | "forgot";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/submissions");
    });
  }, [navigate]);

  const redirectUrl = `${window.location.origin}/#/admin/submissions`;
  const resetRedirectUrl = `${window.location.origin}/#/admin/reset-password`;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/`,
      });
      if (result.error) throw new Error(result.error.message || "Google sign-in failed");
      if (result.redirected) return;
      navigate("/admin/submissions");
    } catch (err) {
      toast({
        title: "Google sign-in failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We sent a verification link. Confirm your email before logging in.",
        });
        setMode("login");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: resetRedirectUrl,
        });
        if (error) throw error;
        toast({
          title: "Password reset email sent",
          description: "Check your inbox for a link to reset your password.",
        });
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            toast({
              title: "Email not verified",
              description: "Please verify your email first. Use 'Resend verification email' below.",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }
        navigate("/admin/submissions");
      }
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      toast({
        title: "Enter your email",
        description: "Type your email above, then click Resend verification email.",
        variant: "destructive",
      });
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) throw error;
      toast({
        title: "Verification email resent",
        description: "Check your inbox (and spam folder).",
      });
    } catch (err) {
      toast({
        title: "Could not resend",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const title =
    mode === "login" ? "Admin Login" : mode === "signup" ? "Admin Sign Up" : "Reset Password";

  return (
    <div className="min-h-screen flex items-center justify-center bg-shivraj-50 p-4">
      <Helmet>
        <title>Admin Login – Shivraj Enterprise</title>
        <meta name="description" content="Secure sign-in for Shivraj Enterprise administrators to manage contact submissions and site content." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4 border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-shivraj-800">{title}</h1>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {mode !== "forgot" && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-shivraj-600 hover:bg-shivraj-700"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Send reset link"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={resendVerification}
          disabled={resending}
        >
          {resending ? "Sending..." : "Resend verification email"}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <div className="flex flex-col gap-2 text-sm text-center">
          {mode === "login" && (
            <>
              <button
                type="button"
                className="text-shivraj-600 hover:underline"
                onClick={() => setMode("signup")}
              >
                Need an account? Sign up
              </button>
              <button
                type="button"
                className="text-shivraj-600 hover:underline"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </>
          )}
          {mode === "signup" && (
            <button
              type="button"
              className="text-shivraj-600 hover:underline"
              onClick={() => setMode("login")}
            >
              Already have an account? Login
            </button>
          )}
          {mode === "forgot" && (
            <button
              type="button"
              className="text-shivraj-600 hover:underline"
              onClick={() => setMode("login")}
            >
              Back to login
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
