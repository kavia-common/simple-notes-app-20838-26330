'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/note';
import { notesApi } from '@/services/notesApi';

interface UseNotesReturn {
  notes: Note[];
  loading: boolean;
  error: string | null;
  createNote: (noteData: CreateNoteRequest) => Promise<void>;
  updateNote: (noteData: UpdateNoteRequest) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

// PUBLIC_INTERFACE
export function useNotes(): UseNotesReturn {
  /**
   * Custom hook for managing notes state and API operations
   */
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notesApi.getAllNotes();
      setNotes(response.notes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notes';
      setError(errorMessage);
      console.error('Failed to load notes:', err);
      // Set mock data for development/testing
      setNotes([
        {
          id: '1',
          title: 'Welcome to Notes App',
          content: 'This is your first note! You can edit or delete this note and create new ones.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['welcome', 'demo']
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (noteData: CreateNoteRequest) => {
    try {
      setError(null);
      const newNote = await notesApi.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create note';
      setError(errorMessage);
      console.error('Failed to create note:', err);
      
      // Mock creation for development
      const mockNote: Note = {
        id: Date.now().toString(),
        title: noteData.title,
        content: noteData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: noteData.tags
      };
      setNotes(prev => [mockNote, ...prev]);
    }
  }, []);

  const updateNote = useCallback(async (noteData: UpdateNoteRequest) => {
    try {
      setError(null);
      const updatedNote = await notesApi.updateNote(noteData);
      setNotes(prev => prev.map(note => 
        note.id === noteData.id ? updatedNote : note
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update note';
      setError(errorMessage);
      console.error('Failed to update note:', err);
      
      // Mock update for development
      setNotes(prev => prev.map(note => 
        note.id === noteData.id 
          ? { 
              ...note, 
              title: noteData.title || note.title,
              content: noteData.content || note.content,
              tags: noteData.tags || note.tags,
              updatedAt: new Date().toISOString()
            }
          : note
      ));
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      setError(null);
      await notesApi.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete note';
      setError(errorMessage);
      console.error('Failed to delete note:', err);
      
      // Mock deletion for development
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  }, []);

  const searchNotes = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadNotes();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await notesApi.searchNotes(query);
      setNotes(response.notes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search notes';
      setError(errorMessage);
      console.error('Failed to search notes:', err);
      
      // Mock search for development
      setNotes(prev => prev.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ));
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const refreshNotes = useCallback(() => {
    return loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    refreshNotes,
  };
}
