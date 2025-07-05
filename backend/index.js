const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
// categories
// Untuk mengambil semua kategori
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data kategori' });
  }
});

// Untuk menambahkan kategori baru
app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: 'Nama kategori tidak boleh kosong' });
    }

    const newCategory = await prisma.category.create({
      data: { name }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambah kategori' });
  }
});

// PUT /categories/:id
app.put('/categories/:id', async (req, res) => {
  const { name } = req.body;
  const id = parseInt(req.params.id);
  if (!name) return res.status(400).json({ error: "Nama tidak boleh kosong" });

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name }
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gagal update kategori" });
  }
});

// DELETE /categories/:id
app.delete('/categories/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Gagal hapus kategori (mungkin masih digunakan produk)" });
  }
});


// products
app.get('/products', async (req, res) => {
  const data = await prisma.product.findMany({ include: { category: true, supplier: true } });
  res.json(data);
});
app.post('/products', async (req, res) => {
  try {
    const { name, price, stock, categoryId, supplierId } = req.body;
    if (!name || !price || !stock || !categoryId || !supplierId) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        categoryId,
        supplierId
      }
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah produk' });
  }
});
// PUT /products/:id
app.put('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, stock, categoryId, supplierId } = req.body;

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { name, price, stock, categoryId, supplierId }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengupdate produk" });
  }
});

// DELETE /products/:id
app.delete('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus produk" });
  }
});

// suppliers
// GET semua supplier
app.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil supplier' });
  }
});

// POST tambah supplier
app.post('/suppliers', async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: 'Nama dan alamat wajib diisi' });
    }

    const supplier = await prisma.supplier.create({
      data: { name, address }
    });

    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah supplier' });
  }
});

// PUT /suppliers/:id
app.put("/suppliers/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, address } = req.body;

  try {
    const updated = await prisma.supplier.update({
      where: { id },
      data: { name, address }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal update supplier" });
  }
});

// DELETE /suppliers/:id
app.delete("/suppliers/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.supplier.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal hapus supplier (mungkin digunakan di produk)" });
  }
});


// transaction
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { id: "desc" }
    });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil daftar transaksi" });
  }
});

app.get("/transactions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        details: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil detail transaksi" });
  }
});

app.post('/transactions', async (req, res) => {
  const { details } = req.body;

  if (!details || details.length === 0) {
    return res.status(400).json({ error: "Detail transaksi kosong" });
  }

  try {
    // 1. Cek semua produk apakah stok cukup
    for (let item of details) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ error: `Produk dengan ID ${item.productId} tidak ditemukan` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          error: `Stok produk "${product.name}" hanya ${product.stock}, tidak cukup untuk beli ${item.qty}`
        });
      }
    }

    const total = details.reduce((sum, item) => sum + item.qty * item.price, 0);

    // 2. Simpan transaksi
    const created = await prisma.transaction.create({
      data: {
        date: new Date(),
        total,
        details: {
          create: details.map(item => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price
          }))
        }
      },
      include: {
        details: true
      }
    });

    // 3. Update stok produk
    for (let item of details) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.qty
          }
        }
      });
    }

    res.status(201).json(created);
  } catch (err) {
    console.error("❌ Gagal transaksi:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
