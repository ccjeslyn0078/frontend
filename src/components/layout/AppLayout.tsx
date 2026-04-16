import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CheckSquare,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mockProjects = [
    "All Projects",
    "E-Commerce Platform",
    "Mobile Banking App",
    "CRM System",
    "Analytics Dashboard"
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/projects") return "Projects";
    if (path === "/reports") return "Reports";
    if (path === "/test-case-status") return "Test Case Status";
    if (path === "/settings") return "Settings";
    if (path.includes("/test-cases/create")) return "Create Test Case";
    if (path.includes("/test-cases")) return "Test Cases";
    if (path.includes("/test-run")) return "Test Run";
    if (path.includes("/bugs/create")) return "Create Bug";
    if (path.includes("/bugs")) return "Bugs";
    return "Test Management System";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">TestManager</h1>
          <p className="text-sm text-gray-500 mt-1">Quality Assurance</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive("/") && location.pathname === "/"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/projects"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive("/projects")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            <span className="font-medium">Projects</span>
          </Link>

          <Link
            to="/reports"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive("/reports")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Reports</span>
          </Link>

          <Link
            to="/test-case-status"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive("/test-case-status")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Test Case Status</span>
          </Link>

          <Link
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive("/settings")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 w-full transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Project Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderKanban className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{selectedProject}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isProjectDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {mockProjects.map((project) => (
                    <button
                      key={project}
                      onClick={() => {
                        setSelectedProject(project);
                        setIsProjectDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <span className="text-sm text-gray-700">{project}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
