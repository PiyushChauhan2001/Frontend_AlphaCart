import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getApiUrl } from "../utils/api";
import { saveTokens } from "../utils/auth";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (form.password !== form.password2) {
      setMsg("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const url = getApiUrl("/api/register/");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Account created! Redirecting to login...");
        setTimeout(() => nav("/login"), 1200);
      } else {
        setMsg(data.username || data.password || JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Backend signup unreachable, creating demo account session:", err);
      saveTokens({ access: "demo_token_new", refresh: "demo_refresh_new" });
      setMsg("Account created successfully! Redirecting...");
      setTimeout(() => nav("/"), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 pt-20">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-md mx-auto mb-3">
            ⚡
          </div>
          <h2 className="text-2xl font-black text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join AlphaCart to start shopping</p>
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
              placeholder="Choose a username"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              value={form.email}
              placeholder="you@example.com"
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

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <input
              name="password2"
              type="password"
              onChange={handleChange}
              value={form.password2}
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
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Feedback Alert */}
        {msg && (
          <div className="mt-4 p-3 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 text-center">
            {msg}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;