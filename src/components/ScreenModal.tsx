import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  screen?: any;
  moduleId: string;
  onSubmit: (data: any) => void; // ✅ ADD THIS
}

export function ScreenModal({
  isOpen,
  onClose,
  screen,
  moduleId,
  onSubmit,
}: ScreenModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (screen) {
      setFormData({
        name: screen.name || '',
        description: screen.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [screen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 THIS WAS MISSING
    onSubmit(formData);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {screen ? 'Edit Screen' : 'Create New Screen'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Screen Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter screen name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Enter screen description"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {screen ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}