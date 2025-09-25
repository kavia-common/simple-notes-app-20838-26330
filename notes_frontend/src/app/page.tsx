'use client';

import React, { useState, useMemo } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/note';
import { useNotes } from '@/hooks/useNotes';
import Sidebar from '@/components/Sidebar';
import NotesList from '@/components/NotesList';
import NoteEditor from '@/components/NoteEditor';

type ViewMode = 'list' | 'edit' | 'create';

// PUBLIC_INTERFACE
export default function Home() {
  /**
   * Main page component for the Notes application
   * Implements the sidebar layout with notes list and editor
   */
  const { 
    notes, 
    loading, 
    error, 
    createNote, 
    updateNote, 
    deleteNote 
  } = useNotes();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes;
    }
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const handleNewNote = () => {
    setSelectedNote(undefined);
    setViewMode('create');
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setViewMode('edit');
  };

  const handleSaveNote = async (noteData: CreateNoteRequest | UpdateNoteRequest) => {
    try {
      setSaveLoading(true);
      
      if ('id' in noteData) {
        // Update existing note
        await updateNote(noteData);
      } else {
        // Create new note
        await createNote(noteData);
      }
      
      setViewMode('list');
      setSelectedNote(undefined);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setViewMode('list');
    setSelectedNote(undefined);
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      if (selectedNote?.id === id) {
        setViewMode('list');
        setSelectedNote(undefined);
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // For real-time search, we filter locally
    // For server-side search, uncomment the line below
    // searchNotes(query);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        onNewNote={handleNewNote}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Notes List */}
        {viewMode === 'list' && (
          <div className="w-1/2 border-r border-gray-200 bg-white">
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedNote?.id}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDeleteNote}
              loading={loading}
            />
          </div>
        )}

        {/* Note Editor or Welcome View */}
        <div className={`${viewMode === 'list' ? 'w-1/2' : 'flex-1'} bg-white`}>
          {(viewMode === 'create' || viewMode === 'edit') ? (
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
              loading={saveLoading}
            />
          ) : selectedNote ? (
            // Note preview when a note is selected
            <div className="h-full p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedNote.title}
                  </h1>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Last updated: {new Date(selectedNote.updatedAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleSelectNote(selectedNote)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit Note
                    </button>
                  </div>
                  {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {selectedNote.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Welcome view when no note is selected
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to Notes App
                </h2>
                <p className="text-gray-600 mb-6">
                  Select a note from the sidebar or create a new one to get started.
                </p>
                <button
                  onClick={handleNewNote}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
