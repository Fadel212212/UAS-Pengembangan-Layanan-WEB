import { NavLink } from "react-router-dom";

export default function Navbar() {
  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-md font-medium ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="text-xl font-bold text-blue-600">
            🛒 E-Commerce
          </div>
          <div className="flex space-x-2">
            <NavLink to="/products" className={navClass}>
              Produk
            </NavLink>
            <NavLink to="/categories" className={navClass}>
              Kategori
            </NavLink>
            <NavLink to="/suppliers" className={navClass}>
              Supplier
            </NavLink>
            <NavLink to="/transactions" className={navClass}>
              Transaksi
            </NavLink>
            <NavLink to="/transaction-details" className={navClass}>
              Laporan Transaksi
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
