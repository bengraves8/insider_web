'use client';

import { useState, ReactNode } from 'react';
import { Pencil, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditableSectionProps {
  title: string;
  onSave: (data: any) => void;
  children: ReactNode;
  editForm: ReactNode;
}

export function EditableSection({ title, onSave, children, editForm }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (data: any) => {
    onSave(data);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div className="border rounded-lg p-4 space-y-4">
          {typeof editForm === 'function' ? editForm(handleSave) : editForm}
        </div>
      ) : (
        children
      )}
    </div>
  );
}