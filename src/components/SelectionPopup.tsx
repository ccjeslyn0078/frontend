import { useNavigate } from 'react-router';
import { ClipboardList, Play, Bug } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface SelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  moduleId: string;
  screenId: string;
  screenName: string;
}

export function SelectionPopup({ 
  isOpen, 
  onClose, 
  projectId, 
  moduleId, 
  screenId,
  screenName 
}: SelectionPopupProps) {
  const navigate = useNavigate();

  const options = [
    {
      title: 'Test Cases',
      description: 'View and manage test cases',
      icon: ClipboardList,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-50',
      iconBg: 'bg-blue-100',
      path: `/projects/${projectId}/modules/${moduleId}/screens/${screenId}/testcases`,
    },
    {
      title: 'Test Run',
      description: 'Execute test cases and record results',
      icon: Play,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-50',
      iconBg: 'bg-green-100',
      path: `/projects/${projectId}/modules/${moduleId}/screens/${screenId}/test-run`,
    },
    {
      title: 'Bugs',
      description: 'View and track bugs',
      icon: Bug,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-50',
      iconBg: 'bg-red-100',
      path: `/projects/${projectId}/modules/${moduleId}/screens/${screenId}/bugs`,
    },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-lg">
      
      <DialogHeader>
        <DialogTitle>
          Select Action for {screenName}
        </DialogTitle>

        {/* 🔥 FIX: Added Description */}
        <DialogDescription>
          Choose what you want to do with this screen
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 mt-4">
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.title}
              onClick={() => handleSelect(option.path)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 ${option.hoverColor} transition-all hover:border-gray-300 text-left`}
            >
              <div className={`${option.iconBg} p-3 rounded-lg`}>
                <Icon
                  className={`w-6 h-6 ${option.color.replace(
                    "bg-",
                    "text-"
                  )}`}
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </DialogContent>
  </Dialog>
);
}