import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const API = "http://localhost:3001";

  const loadCategories = () => {
    axios.get(`${API}/categories`).then(res => setCategories(res.data));
  };

  useEffect(loadCategories, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingId) {
      axios.put(`${API}/categories/${editingId}`, { name: form.name })
        .then(() => {
          setForm({ name: "" });
          setEditingId(null);
          setMessage("✅ Kategori berhasil diperbarui");
          loadCategories();
        });
    } else {
      axios.post(`${API}/categories`, { name: form.name }).then(() => {
        setForm({ name: "" });
        setMessage("✅ Kategori berhasil ditambahkan");
        loadCategories();
      });
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name });
  };

  const handleDelete = (id) => {
    if (confirm("Hapus kategori ini?")) {
      axios.delete(`${API}/categories/${id}`).then(() => {
        setMessage("✅ Kategori dihapus");
        loadCategories();
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📂 Manajemen Kategori</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={form.name}
          onChange={e => setForm({ name: e.target.value })}
          placeholder="Nama Kategori"
          className="border px-2 py-1 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded">
          {editingId ? "Simpan" : "Tambah"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ name: "" });
            }}
            className="text-gray-500"
          >
            Batal
          </button>
        )}
      </form>

      {message && <p className="text-green-600 mb-2">{message}</p>}

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td className="border p-2">{cat.name}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => startEdit(cat)}
                  className="text-blue-500 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-500 underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
