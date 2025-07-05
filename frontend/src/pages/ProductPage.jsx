import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    supplierId: "",
    price: "",
    stock: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const API = "http://localhost:3001";

  const loadAll = () => {
    axios.get(`${API}/products`).then(res => setProducts(res.data));
    axios.get(`${API}/categories`).then(res => setCategories(res.data));
    axios.get(`${API}/suppliers`).then(res => setSuppliers(res.data));
  };

  useEffect(loadAll, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      categoryId: parseInt(form.categoryId),
      supplierId: parseInt(form.supplierId),
      price: parseInt(form.price),
      stock: parseInt(form.stock)
    };

    if (editingId) {
      axios.put(`${API}/products/${editingId}`, data).then(() => {
        setMessage("✅ Produk berhasil diupdate");
        setForm({ name: "", categoryId: "", supplierId: "", price: "", stock: "" });
        setEditingId(null);
        loadAll();
      });
    } else {
      axios.post(`${API}/products`, data).then(() => {
        setMessage("✅ Produk ditambahkan");
        setForm({ name: "", categoryId: "", supplierId: "", price: "", stock: "" });
        loadAll();
      });
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      categoryId: p.categoryId.toString(),
      supplierId: p.supplierId.toString(),
      price: p.price.toString(),
      stock: p.stock.toString()
    });
  };

  const handleDelete = (id) => {
    if (confirm("Hapus produk ini?")) {
      axios.delete(`${API}/products/${id}`).then(() => {
        setMessage("✅ Produk dihapus");
        loadAll();
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📦 Manajemen Produk</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mb-6">
        <input
          placeholder="Nama Produk"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Harga"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="border px-2 py-1 rounded"
          type="number"
        />
        <input
          placeholder="Stok"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          className="border px-2 py-1 rounded"
          type="number"
        />
        <select
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
          className="border px-2 py-1 rounded"
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={form.supplierId}
          onChange={e => setForm({ ...form, supplierId: e.target.value })}
          className="border px-2 py-1 rounded"
        >
          <option value="">-- Pilih Supplier --</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <button className="bg-blue-600 text-white px-4 py-1 rounded col-span-2">
          {editingId ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
      </form>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Kategori</th>
            <th className="border p-2">Supplier</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">Stok</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.category?.name}</td>
              <td className="border p-2">{p.supplier?.name}</td>
              <td className="border p-2">Rp{p.price}</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => startEdit(p)} className="text-blue-500 underline">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
