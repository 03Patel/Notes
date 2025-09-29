import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

interface Note {
  _id: string;
  title: string;
  content: string;
}

export const Welcome = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // Fetch notes
  const fetchNotes = async () => {
    try {
      if (!token) return;
      const res = await api.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      if (err.response?.status === 401) logout();
    }
  };

  // Add a new note
  const addNote = async () => {
    if (!title || !content) {
      setError("Title and Content are required");
      return;
    }
    try {
      if (!token) return;
      const res = await api.post(
        "/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([...notes, res.data]);
      setTitle("");
      setContent("");
      setError("");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError("Failed to add note");
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    try {
      if (!token) return;
      await api.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError("Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name || "User"}
          </h1>
         
        </header>

        {/* Add Note Form */}
        <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add a Note</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-3 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <button
            onClick={addNote}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
          >
            Add Note
          </button>
        </section>

        {/* Notes List */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes yet</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{note.title}</h3>
                  <p className="text-gray-700 mb-4">{note.content}</p>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
