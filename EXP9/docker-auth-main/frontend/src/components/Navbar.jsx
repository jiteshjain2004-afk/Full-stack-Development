import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle("dark");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="text-lg font-bold tracking-tight">
          Auth Dashboard
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={toggleTheme}
            className="rounded-md border border-slate-300 px-3 py-1.5 dark:border-slate-700"
          >
            Theme
          </button>
          {token ? (
            <>
              <span className="hidden text-slate-500 md:inline dark:text-slate-300">
                {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white dark:bg-slate-100 dark:text-slate-950"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white dark:bg-slate-100 dark:text-slate-950"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
