import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
