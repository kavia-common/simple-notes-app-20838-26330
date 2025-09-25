import { Note, CreateNoteRequest, UpdateNoteRequest, NotesResponse } from '@/types/note';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class NotesApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  async getAllNotes(): Promise<NotesResponse> {
    /**
     * Fetches all notes from the backend
     * @returns Promise<NotesResponse> - Array of notes with total count
     */
    return this.makeRequest<NotesResponse>('/notes');
  }

  // PUBLIC_INTERFACE
  async getNoteById(id: string): Promise<Note> {
    /**
     * Fetches a specific note by ID
     * @param id - The note ID
     * @returns Promise<Note> - The requested note
     */
    return this.makeRequest<Note>(`/notes/${id}`);
  }

  // PUBLIC_INTERFACE
  async createNote(noteData: CreateNoteRequest): Promise<Note> {
    /**
     * Creates a new note
     * @param noteData - The note data to create
     * @returns Promise<Note> - The created note
     */
    return this.makeRequest<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  // PUBLIC_INTERFACE
  async updateNote(noteData: UpdateNoteRequest): Promise<Note> {
    /**
     * Updates an existing note
     * @param noteData - The note data to update
     * @returns Promise<Note> - The updated note
     */
    return this.makeRequest<Note>(`/notes/${noteData.id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: string): Promise<void> {
    /**
     * Deletes a note by ID
     * @param id - The note ID to delete
     * @returns Promise<void>
     */
    await this.makeRequest<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  // PUBLIC_INTERFACE
  async searchNotes(query: string): Promise<NotesResponse> {
    /**
     * Searches notes by query string
     * @param query - The search query
     * @returns Promise<NotesResponse> - Filtered notes matching the query
     */
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest<NotesResponse>(`/notes/search?q=${encodedQuery}`);
  }
}

export const notesApi = new NotesApiService();
