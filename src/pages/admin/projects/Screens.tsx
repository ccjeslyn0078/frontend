import { useState } from 'react';
import { useParams } from 'react-router';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { mockScreens, mockModules, mockProjects } from '../../../data/mockData';
import { ScreenModal } from '../../../components/ScreenModal';
import { SelectionPopup } from '../../../components/SelectionPopup';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/layout/BreadCrumb';

export function Screens() {
  const { projectId, moduleId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  
  const project = mockProjects.find(p => p.id === projectId);
  const module = mockModules.find(m => m.id === moduleId);
  const screens = mockScreens.filter(s => s.moduleId === moduleId);

  const handleEdit = (screen: any) => {
    setEditingScreen(screen);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingScreen(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScreen(null);
  };

  const handleScreenClick = (screenId: string) => {
    setSelectedScreen(screenId);
  };

  const handleCloseSelection = () => {
    setSelectedScreen(null);
  };

  const selectedScreenData = screens.find(s => s.id === selectedScreen);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}/modules`}>
              {project?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{module?.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Screens</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Screens</h2>
          <p className="text-gray-600 mt-1">{module?.name}</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Screen
        </button>
      </div>

      {/* Screens Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Screen Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {screens.map((screen) => (
              <tr key={screen.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleScreenClick(screen.id)}
                    className="font-medium text-gray-800 hover:text-blue-600 transition-colors text-left"
                  >
                    {screen.name}
                  </button>
                </td>
                <td className="px-6 py-4 text-gray-600">{screen.description || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(screen)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Screen Modal */}
      <ScreenModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        screen={editingScreen}
        moduleId={moduleId!}
      />

      {/* Selection Popup */}
      <SelectionPopup
        isOpen={!!selectedScreen}
        onClose={handleCloseSelection}
        projectId={projectId!}
        moduleId={moduleId!}
        screenId={selectedScreen || ''}
        screenName={selectedScreenData?.name || ''}
      />
    </div>
  );
}