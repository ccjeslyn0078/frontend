import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface TopbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
}

export default function Topbar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: TopbarProps) {
  const location = useLocation();

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
    </header>
  );
}