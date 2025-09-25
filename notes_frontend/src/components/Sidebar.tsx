'use client';

import React from 'react';
import Button from './Button';

interface SidebarProps {
  onNewNote: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

// PUBLIC_INTERFACE
export default function Sidebar({ onNewNote, onSearch, searchQuery }: SidebarProps) {
  /**
   * Sidebar component for navigation and search functionality
   */
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Notes App</h1>
        <p className="text-sm text-gray-600 mt-1">Organize your thoughts</p>
      </div>

      {/* New Note Button */}
      <div className="p-4">
        <Button 
          onClick={onNewNote} 
          variant="primary" 
          className="w-full"
        >
          + New Note
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4">
        <nav className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg font-medium">
            All Notes
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Recent
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Favorites
          </button>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">Ocean Professional Theme</p>
      </div>
    </div>
  );
}
