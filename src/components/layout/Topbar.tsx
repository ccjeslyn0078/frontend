import { useLocation } from "react-router-dom";
import { FolderKanban, ChevronDown, User, Menu, X } from "lucide-react";

interface TopbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  selectedProject: string;
  setSelectedProject: (val: string) => void;
  isProjectDropdownOpen: boolean;
  setIsProjectDropdownOpen: (val: boolean) => void;
}

export default function Topbar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  selectedProject,
  setSelectedProject,
  isProjectDropdownOpen,
  setIsProjectDropdownOpen,
}: TopbarProps) {
  const location = useLocation();

  const mockProjects = [
    "All Projects",
    "E-Commerce Platform",
    "Mobile Banking App",
    "CRM System",
    "Analytics Dashboard",
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/projects") return "Projects";
    if (path === "/reports") return "Reports";
    if (path === "/test-case-status") return "Test Case Status";
    if (path === "/settings") return "Settings";
    return "Test Management System";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <FolderKanban className="w-4 h-4" />
            {selectedProject}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow">
              {mockProjects.map((project) => (
                <button
                  key={project}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsProjectDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  {project}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <User />
        </button>
      </div>
    </header>
  );
}