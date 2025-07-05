import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionDetailPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState([]);
  const [total, setTotal] = useState(0);

  const API = "http://localhost:3001";

  useEffect(() => {
    axios.get(`${API}/transactions`).then(res => {
      setTransactions(res.data);
    });
  }, []);

  const loadDetail = (id) => {
    setSelectedId(id);
    axios.get(`${API}/transactions/${id}`).then(res => {
      setDetails(res.data.details || []);
      const totalHarga = res.data.details.reduce((acc, d) => acc + d.qty * d.product.price, 0);
      setTotal(totalHarga);
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🧾 Laporan Detail Transaksi</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {transactions.map(t => (
          <button
            key={t.id}
            onClick={() => loadDetail(t.id)}
            className={`px-4 py-2 rounded border ${selectedId === t.id ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Transaksi #{t.id}
          </button>
        ))}
      </div>

      {selectedId && (
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">🧾 Rincian Transaksi #{selectedId}</h3>
          <table className="w-full border mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Produk</th>
                <th className="border p-2">Harga</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, i) => (
                <tr key={i}>
                  <td className="border p-2">{d.product.name}</td>
                  <td className="border p-2">Rp{d.product.price}</td>
                  <td className="border p-2">{d.qty}</td>
                  <td className="border p-2">Rp{d.product.price * d.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-right text-lg font-bold">Total: Rp{total}</p>
        </div>
      )}
    </div>
  );
}
