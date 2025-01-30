import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Edit, Trash2 } from 'lucide-react';

const NOTE_CATEGORIES = [
  'Customer Order',
  'Parts Order',
  'Call Back',
  'Reminder',
  'Staff Communication',
  'Inventory'
];

const NOTE_STATUSES = [
  'Open',
  'In Progress',
  'Completed',
  'Cancelled',
  'On Hold'
];

const NotesSystem = ({ onClose }) => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('pos_notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    localStorage.setItem('pos_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = (note) => {
    if (note.createdAt) {
      setNotes(prev => prev.map(n => n.createdAt === note.createdAt ? note : n));
    } else {
      const newNote = {
        ...note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setShowForm(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteToDelete) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(n => n.createdAt !== noteToDelete.createdAt));
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || note.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Notes System</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => {
                setEditingNote(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              <Plus size={16} />
              Add Note
            </button>

            <div className="flex-1 relative">
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-8 pr-2 py-1.5 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <select
              className="p-1.5 border rounded text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {NOTE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="p-1.5 border rounded text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {NOTE_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotes.length > 0 ? (
            <div className="space-y-2">
              {filteredNotes.map(note => (
                <div key={note.createdAt} className="p-3 bg-gray-50 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {note.title || 'Untitled Note'}
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          note.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          note.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {note.status}
                        </span>
                      </h3>
                      {note.category && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {note.category}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{note.body}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setShowForm(true);
                      }}
                      className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note)}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No notes found
            </div>
          )}
        </div>

        {/* Note Form Modal */}
        {showForm && (
           <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h3>
              
              <NoteForm
                note={editingNote}
                onSave={handleSaveNote}
                onCancel={() => {
                  setShowForm(false);
                  setEditingNote(null);
                }}
                categories={NOTE_CATEGORIES}
                statuses={NOTE_STATUSES}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NoteForm = ({ note, onSave, onCancel, categories, statuses }) => {
  const [formState, setFormState] = useState({
    title: '',
    body: '',
    category: '',
    status: 'Open',
    ...note
  });

  const handleSave = () => {
    if (!formState.body.trim()) return;
    onSave({
      ...formState,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Title (optional)"
        className="w-full p-2 border rounded"
        value={formState.title}
        onChange={(e) => setFormState(prev => ({...prev, title: e.target.value}))}
      />
      
      <textarea
        placeholder="Note content*"
        className="w-full p-2 border rounded h-32"
        value={formState.body}
        onChange={(e) => setFormState(prev => ({...prev, body: e.target.value}))}
        required
      />
      
      <select
        className="w-full p-2 border rounded"
        value={formState.category}
        onChange={(e) => setFormState(prev => ({...prev, category: e.target.value}))}
      >
        <option value="">Select Category (optional)</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <select
        className="w-full p-2 border rounded"
        value={formState.status}
        onChange={(e) => setFormState(prev => ({...prev, status: e.target.value}))}
      >
        {statuses.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          disabled={!formState.body.trim()}
        >
          Save Note
        </button>
      </div>
    </div>
  );
};

export default NotesSystem;