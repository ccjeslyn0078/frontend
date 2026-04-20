import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronRight, Pencil, Trash2, Plus } from 'lucide-react';
import { mockModules, mockProjects } from '../../../data/mockData';
import { ModuleModal } from '../../../components/ModuleModal';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/layout/BreadCrumb';

export function Modules() {
  const { projectId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  
  const project = mockProjects.find(p => p.id === projectId);
  const modules = mockModules.filter(m => m.projectId === projectId);

  const handleEdit = (module: any) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingModule(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
  };

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
            <BreadcrumbPage>{project?.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Modules</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Modules</h2>
          <p className="text-gray-600 mt-1">{project?.name}</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Module
        </button>
      </div>

      {/* Modules Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Module Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Screens</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {modules.map((module) => (
              <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    to={`/projects/${projectId}/modules/${module.id}/screens`}
                    className="font-medium text-gray-800 hover:text-blue-600 flex items-center gap-2 group"
                  >
                    {module.name}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">{module.description}</td>
                <td className="px-6 py-4 text-gray-600">{module.screenCount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(module)}
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

      {/* Module Modal */}
      <ModuleModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        module={editingModule}
        projectId={projectId!}
      />
    </div>
  );
}