import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module?: any;
  projectId: string;
  onSubmit: (data: any) => void; // ✅ ADD THIS
}

export function ModuleModal({
  isOpen,
  onClose,
  module,
  projectId,
  onSubmit,
}: ModuleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (module) {
      setFormData({
        name: module.name || '',
        description: module.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [module]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ CALL PARENT FUNCTION (THIS WAS MISSING 🔥)
    onSubmit(formData);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {module ? 'Edit Module' : 'Add New Module'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Module Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter module name"
              required
            />
          </div>

          {/* ⚠️ KEEP UI but backend ignores description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Enter module description"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {module ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}