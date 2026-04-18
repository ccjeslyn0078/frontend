import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CheckSquare,
  Settings as SettingsIcon,
  LogOut
} from "lucide-react";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">TestManager</h1>
        <p className="text-sm text-gray-500 mt-1">Quality Assurance</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
            isActive("/") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        <Link
          to="/projects"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
            isActive("/projects") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FolderKanban className="w-5 h-5" />
          Projects
        </Link>

        <Link
          to="/reports"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <FileText className="w-5 h-5" />
          Reports
        </Link>

        <Link
          to="/test-case-status"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <CheckSquare className="w-5 h-5" />
          Test Case Status
        </Link>

        <Link
          to="/settings"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <SettingsIcon className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}