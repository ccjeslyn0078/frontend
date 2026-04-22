import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from '@/components/ui/Input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface BugModalProps {
  isOpen: boolean;
  onClose: () => void;
  testCase?: any;
}

export function BugModal({ isOpen, onClose, testCase }: BugModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    severity: 'Medium',
    assignedTo: '',
  });

  useEffect(() => {
    if (testCase) {
      setFormData({
        title: `Bug in ${testCase.title}`,
        severity: testCase.priority || 'Medium',
        assignedTo: '',
      });
    }
  }, [testCase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create bug:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Bug Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {testCase && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Test Case ID: <span className="font-medium text-gray-800">{testCase.id}</span></p>
              <p className="text-sm text-gray-600">Title: <span className="font-medium text-gray-800">{testCase.title}</span></p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bugTitle">Bug Title</Label>
            <Input
              id="bugTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter bug title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="Enter assignee name"
              required
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
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Create Bug
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
