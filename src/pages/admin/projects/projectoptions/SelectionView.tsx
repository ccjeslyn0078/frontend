import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Breadcrumb } from "../../../../components/layout/BreadCrumb";
import { Filter } from "lucide-react";

export function SelectionView() {
  const { projectId, option } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("");

  const projectName = projectId?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Project";
  const optionName = option?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Option";

  const modules = [
    "Authentication",
    "User Management",
    "Payment Processing",
    "Reporting",
    "Dashboard",
    "Settings",
    "API Integration",
    "Notifications",
  ];

  const testTypes = ["Functional", "Non-functional", "Sanity"];

  // Screen options based on selected module
  const screenOptions: Record<string, string[]> = {
    Authentication: [
      "Login Page",
      "Signup / Registration Page",
      "Forgot Password Page",
      "Reset Password Page",
      "OTP Verification Page",
    ],
    "User Management": [
      "User List Page",
      "User Detail Page",
      "Create User Page",
      "Edit User Page",
      "Role Assignment Page",
    ],
    "Payment Processing": [
      "Payment Page",
      "Checkout Page",
      "Transaction History Page",
      "Payment Confirmation Page",
    ],
    Reporting: [
      "Reports Page",
      "Analytics Dashboard",
      "Export Reports Page",
    ],
    Dashboard: [
      "Dashboard Page",
      "Widgets View",
      "Activity Feed",
    ],
    Settings: [
      "Settings Page",
      "Preferences Page",
      "Configuration Page",
    ],
    "API Integration": [
      "API Request Page",
      "API Response Viewer",
      "API Logs Page",
    ],
    Notifications: [
      "Notifications Page",
      "Alerts View",
      "Message Center",
    ],
  };

  const availableScreens = selectedModule ? screenOptions[selectedModule] || [] : [];

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setSelectedScreen(""); // Reset screen when module changes
  };

  const handleContinue = () => {
    if (selectedModule && option) {
      if (option === "test-cases") {
        navigate(`/projects/${projectId}/${option}/${selectedModule}/test-cases`);
      } else if (option === "test-run") {
        navigate(`/projects/${projectId}/${option}/${selectedModule}/test-run`);
      } else if (option === "bugs") {
        navigate(`/projects/${projectId}/${option}/${selectedModule}/bugs`);
      }
    }
  };

  return (
    <div className="p-8">
      <Breadcrumb
        items={[
          { label: "Projects", to: "/projects" },
          { label: projectName },
          { label: optionName },
        ]}
      />

      <div className="mt-8">
        <h1 className="text-2xl font-semibold text-gray-900">{optionName}</h1>
        <p className="text-gray-600 mt-1">Select filters to view data</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedModule}
              onChange={(e) => handleModuleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select a module</option>
              {modules.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>

          {/* Screen Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screen
            </label>
            <select
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(e.target.value)}
              disabled={!selectedModule}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <option value="">Select a screen</option>
              {availableScreens.map((screen) => (
                <option key={screen} value={screen}>
                  {screen}
                </option>
              ))}
            </select>
          </div>

          {/* Type of Testing Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type of Testing</label>
            <select
              value={selectedTestType}
              onChange={(e) => setSelectedTestType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Types</option>
              {testTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleContinue}
            disabled={!selectedModule}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!selectedModule && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 mt-8 text-center">
          <div className="max-w-md mx-auto">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Module Selected</h3>
            <p className="text-gray-600">
              Please select a module from the filters above to view {optionName.toLowerCase()} data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
