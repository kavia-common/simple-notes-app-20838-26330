'use client';

import React from 'react';
import { Note } from '@/types/note';
import Loading from './Loading';

interface NotesListProps {
  notes: Note[];
  selectedNoteId?: string;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  loading: boolean;
}

// PUBLIC_INTERFACE
export default function NotesList({ 
  notes, 
  selectedNoteId, 
  onSelectNote, 
  onDeleteNote, 
  loading 
}: NotesListProps) {
  /**
   * Component to display a list of notes with selection and deletion functionality
   */
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading text="Loading notes..." />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600">Create your first note to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          All Notes ({notes.length})
        </h2>
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedNoteId === note.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onSelectNote(note)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {note.content || 'No content'}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {note.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{note.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete note"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
