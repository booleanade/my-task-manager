import { supabase } from "../lib/supabase";

export default function Auth() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">✓</div>

        <h1>Task Manager</h1>

        <p className="subtitle">
          Organize your work. Stay productive.
        </p>

        <button
          className="google-button"
          onClick={handleGoogleLogin}
        >
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <p className="auth-note">
          Sign in securely with your Google account.
        </p>
      </div>
    </div>
  );
}