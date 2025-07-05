import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  const API = "http://localhost:3001";

  useEffect(() => {
    axios.get(`${API}/products`).then(res => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        qty: 1,
        price: product.price
      }]);
    }
  };

  const decreaseFromCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (!existing) return;

    if (existing.qty === 1) {
      // Hapus dari cart
      setCart(cart.filter(item => item.productId !== product.id));
    } else {
      // Kurangi qty
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, qty: item.qty - 1 }
          : item
      ));
    }
  };

  const handleSubmit = () => {
    if (cart.length === 0) return;

    axios.post(`${API}/transactions`, { details: cart }).then(() => {
      setCart([]);
      setMessage("✅ Transaksi berhasil disimpan");
    }).catch(err => {
      setMessage(err.response?.data?.error || "❌ Gagal menyimpan transaksi");
    });
  };

  const totalHarga = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🧾 Transaksi Penjualan</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="grid grid-cols-2 gap-4">
        {/* Produk */}
        <div>
          <h3 className="font-semibold mb-2">📦 Daftar Produk</h3>
          <ul className="space-y-1">
            {products.map(p => (
              <li key={p.id} className="flex justify-between items-center border-b py-1">
                <span>{p.name} - Rp{p.price}</span>
                <div className="space-x-1">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => addToCart(p)}
                  >
                    + Tambah
                  </button>
                  <button
                    className="text-red-500 underline"
                    onClick={() => decreaseFromCart(p)}
                  >
                    - Kurang
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Keranjang */}
        <div>
          <h3 className="font-semibold mb-2">🛒 Keranjang</h3>
          {cart.length === 0 ? (
            <p>Belum ada item.</p>
          ) : (
            <ul className="space-y-1">
              {cart.map((item, idx) => {
                const p = products.find(prod => prod.id === item.productId);
                return (
                  <li key={idx}>
                    {p?.name} x {item.qty} = Rp{item.qty * item.price}
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-2 font-semibold">Total: Rp{totalHarga}</p>
          <button
            onClick={handleSubmit}
            className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
          >
            Simpan Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}
