import { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const API = "http://localhost:3001";

  const loadSuppliers = () => {
    axios.get(`${API}/suppliers`).then(res => setSuppliers(res.data));
  };

  useEffect(loadSuppliers, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const data = { ...form };

    if (editingId) {
      axios.put(`${API}/suppliers/${editingId}`, data).then(() => {
        setMessage("✅ Supplier diperbarui");
        setForm({ name: "", address: "" });
        setEditingId(null);
        loadSuppliers();
      });
    } else {
      axios.post(`${API}/suppliers`, data).then(() => {
        setMessage("✅ Supplier ditambahkan");
        setForm({ name: "", address: "" });
        loadSuppliers();
      });
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({ name: s.name, address: s.address || "" });
  };

  const handleDelete = (id) => {
    if (confirm("Hapus supplier ini?")) {
      axios.delete(`${API}/suppliers/${id}`).then(() => {
        setMessage("✅ Supplier dihapus");
        loadSuppliers();
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏭 Manajemen Supplier</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mb-6">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nama Supplier"
          className="border px-2 py-1 rounded"
        />
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Alamat"
          className="border px-2 py-1 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded col-span-2">
          {editingId ? "Simpan Perubahan" : "Tambah Supplier"}
        </button>
      </form>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Alamat</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.address || "-"}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => startEdit(s)} className="text-blue-500 underline">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="text-red-500 underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
