import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveTokens } from "../utils/auth";
import { getApiUrl } from "../utils/api";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const url = getApiUrl("/api/token/");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        saveTokens(data);
        setMsg("Login successful! Redirecting...");
        setTimeout(() => nav("/"), 800);
      } else {
        setMsg(data.detail || "Invalid credentials");
      }
    } catch (err) {
      console.warn("Backend login failed, using demo login session:", err);
      // Demo session fallback for static deployment testing
      saveTokens({ access: "demo_access_token_123", refresh: "demo_refresh_token_123" });
      setMsg("Logged in as Demo User!");
      setTimeout(() => nav("/"), 800);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    saveTokens({ access: "demo_access_token_123", refresh: "demo_refresh_token_123" });
    setMsg("Logged in as Demo User!");
    setTimeout(() => nav("/"), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 pt-20">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-md mx-auto mb-3">
            ⚡
          </div>
          <h2 className="text-2xl font-black text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your orders and cart</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              name="username"
              onChange={handleChange}
              value={form.username}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              value={form.password}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Quick Button */}
        <div className="mt-4">
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all"
          >
            🚀 Quick Demo Login (Skip Auth)
          </button>
        </div>

        {/* Feedback Alert */}
        {msg && (
          <div className="mt-4 p-3 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 text-center">
            {msg}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;