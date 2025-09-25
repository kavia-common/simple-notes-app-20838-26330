'use client';

import React, { useState, useEffect } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/note';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: CreateNoteRequest | UpdateNoteRequest) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onCancel, loading }: NoteEditorProps) {
  /**
   * Component for creating and editing notes
   */
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTagsInput(note.tags?.join(', ') || '');
    } else {
      setTitle('');
      setContent('');
      setTagsInput('');
    }
    setErrors({});
  }, [note]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      if (note) {
        // Update existing note
        await onSave({
          id: note.id,
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : undefined,
        });
      } else {
        // Create new note
        await onSave({
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : undefined,
        });
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <div className="flex space-x-3">
            <Button 
              onClick={onCancel} 
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <Input
            label="Title"
            placeholder="Enter note title..."
            value={title}
            onChange={setTitle}
            error={errors.title}
            disabled={loading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <Input
              placeholder="work, personal, ideas..."
              value={tagsInput}
              onChange={setTagsInput}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Add tags to organize your notes (optional)
            </p>
          </div>

          <Textarea
            label="Content"
            placeholder="Start writing your note..."
            value={content}
            onChange={setContent}
            error={errors.content}
            rows={12}
            disabled={loading}
          />

          {/* Metadata for existing note */}
          {note && (
            <div className="text-sm text-gray-500 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(note.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{' '}
                  {new Date(note.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
