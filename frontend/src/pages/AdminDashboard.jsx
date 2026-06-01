import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Package, ShoppingCart, Users, Plus, Pencil, Trash2, CheckCircle2, Upload } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { API_BASE_URL, apiUrl } from '../lib/api';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: '',
  brand: '',
  color: '',
  material: '',
  countInStock: '',
  images: [],
};

const normalizeImages = (images) => {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === 'string') {
    return images.split(',').map((img) => img.trim()).filter(Boolean);
  }
  return [];
};

const AdminDashboard = () => {
  const { userInfo } = useAuthStore();
  const [overview, setOverview] = useState({ products: 0, orders: 0, users: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const config = useMemo(() => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }), [userInfo]);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewRes, productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(apiUrl('/api/admin/overview'), config),
        axios.get(apiUrl('/api/admin/products'), config),
        axios.get(apiUrl('/api/admin/orders'), config),
        axios.get(apiUrl('/api/admin/users'), config),
      ]);

      setOverview(overviewRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
    setUploadMessage('');
  };

  const removeImage = (imageToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: normalizeImages(prev.images).filter((img) => img !== imageToRemove),
    }));
  };

  const resizeImageFile = (file, maxSize = 1200, quality = 0.86) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image processing failed'));
              return;
            }
            const processedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
            resolve(processedFile);
          },
          'image/jpeg',
          quality,
        );
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const uploadLocalImage = async (file) => {
    setUploading(true);
    setUploadMessage('Uploading image...');
    try {
      const resized = await resizeImageFile(file);
      const formData = new FormData();
      formData.append('image', resized);

      const response = await axios.post(apiUrl('/api/admin/upload'), formData, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      const fullUrl = `${API_BASE_URL}${response.data.imageUrl}`;
      setForm((prev) => ({
        ...prev,
        images: [...normalizeImages(prev.images), fullUrl],
      }));
      setUploadMessage('Image uploaded successfully.');
    } catch (error) {
      setUploadMessage(error?.response?.data?.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
      images: normalizeImages(form.images),
    };

    if (editingId) {
      await axios.put(apiUrl(`/api/admin/products/${editingId}`), payload, config);
    } else {
      await axios.post(apiUrl('/api/admin/products'), payload, config);
    }

    resetForm();
    loadAdminData();
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      ...product,
      images: normalizeImages(product.images),
    });
    setActiveTab('products');
    setUploadMessage('');
  };

  const deleteProduct = async (id) => {
    await axios.delete(apiUrl(`/api/admin/products/${id}`), config);
    loadAdminData();
  };

  const markDelivered = async (id) => {
    await axios.put(apiUrl(`/api/admin/orders/${id}/deliver`), {}, config);
    loadAdminData();
  };

  const toggleAdmin = async (user) => {
    await axios.put(apiUrl(`/api/admin/users/${user._id}`), {
      name: user.name,
      email: user.email,
      isAdmin: !user.isAdmin,
    }, config);
    loadAdminData();
  };

  const stats = [
    { label: 'Products', value: overview.products, icon: <Package className="w-5 h-5" /> },
    { label: 'Orders', value: overview.orders, icon: <ShoppingCart className="w-5 h-5" /> },
    { label: 'Users', value: overview.users, icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-14 fade-in">
      <div className="mb-10">
        <p className="section-label mb-3">Admin panel</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[var(--fg)]">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center justify-between mb-4 text-[var(--accent)]">{stat.icon}<span className="text-3xl font-light text-[var(--fg)]">{stat.value}</span></div>
            <p className="text-sm text-[var(--fg-muted)] uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {['products', 'orders', 'users'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xs uppercase tracking-widest border ${activeTab === tab ? 'bg-[var(--fg)] text-white border-[var(--fg)]' : 'border-[var(--border)] text-[var(--fg-muted)] bg-[var(--bg-card)]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? <div className="text-[var(--fg-muted)]">Loading admin data...</div> : null}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
          <form onSubmit={submitProduct} className="border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-['Cormorant_Garamond'] text-3xl text-[var(--fg)]">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              {editingId ? <button type="button" onClick={resetForm} className="text-xs uppercase tracking-widest text-[var(--accent)]">Reset</button> : null}
            </div>
            <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="input-field min-h-[120px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" min="0" step="0.01" className="input-field" placeholder="Price (£)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <input type="number" min="0" step="1" className="input-field" placeholder="Stock" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <input className="input-field" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              <input className="input-field" placeholder="Material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
            </div>
            <div className="border border-[var(--border)] bg-[var(--bg-muted)] p-4">
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-light)] mb-3">Upload from local PC</label>
              <label className="btn-outline cursor-pointer" style={{ width: 'auto', padding: '0.75rem 1rem' }}>
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Choose image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await uploadLocalImage(file);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
              <p className="text-xs text-[var(--fg-muted)] mt-3 font-light">
                Images are automatically scaled down, uploaded, and saved to the database with the product.
              </p>
              {uploadMessage ? (
                <p className="text-xs mt-3 text-[var(--accent)] font-medium">{uploadMessage}</p>
              ) : null}
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-light)]">Uploaded images</label>
              {normalizeImages(form.images).length === 0 ? (
                <p className="text-sm text-[var(--fg-muted)] font-light">No images uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {normalizeImages(form.images).map((img) => (
                    <div key={img} className="relative border border-[var(--border)] bg-[var(--bg-card)] p-2">
                      <img src={img} alt="Uploaded product" className="w-full aspect-[4/5] object-cover bg-[var(--bg-muted)]" />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="mt-2 text-xs uppercase tracking-widest text-red-500 hover:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="btn-primary"><Plus className="w-4 h-4" /> {editingId ? 'Update Product' : 'Create Product'}</button>
          </form>

          <div className="border border-[var(--border)] bg-[var(--bg-card)] p-6 overflow-auto">
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-[var(--fg)] mb-5">Products</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="border border-[var(--border)] p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex gap-4 items-center">
                    <img src={product.images?.[0]} alt={product.name} className="w-16 h-20 object-cover bg-[var(--bg-muted)]" />
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-2xl text-[var(--fg)]">{product.name}</h3>
                      <p className="text-sm text-[var(--fg-muted)]">{product.category} · £{product.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editProduct(product)} className="btn-outline" style={{ width: 'auto', padding: '0.65rem 1rem' }}><Pencil className="w-4 h-4" /> Edit</button>
                    <button onClick={() => deleteProduct(product._id)} className="btn-outline" style={{ width: 'auto', padding: '0.65rem 1rem' }}><Trash2 className="w-4 h-4" /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-[var(--fg)]">Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="border border-[var(--border)] p-5 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-5">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--fg-muted)]">Order ID: {order._id}</p>
                  <p className="text-sm text-[var(--fg-muted)]">Items: {order.orderItems?.length || 0} · Total: £{Number(order.totalPrice || 0).toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[var(--border)] bg-[var(--bg-muted)] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--fg-light)] mb-2">Delivery address</p>
                    <p className="text-sm text-[var(--fg)]">{order.shippingAddress?.address || '—'}</p>
                    <p className="text-sm text-[var(--fg-muted)] mt-1">
                      {order.shippingAddress?.city || '—'}, {order.shippingAddress?.postalCode || '—'}
                    </p>
                    <p className="text-sm text-[var(--fg-muted)]">{order.shippingAddress?.country || '—'}</p>
                  </div>

                  <div className="border border-[var(--border)] bg-[var(--bg-card)] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--fg-light)] mb-2">Payment info</p>
                    <p className="text-sm text-[var(--fg)]">Method: {order.paymentMethod || '—'}</p>
                    <p className="text-sm text-[var(--fg-muted)] mt-1">Email: {order.guestEmail || '—'}</p>
                    <p className="text-sm text-[var(--fg-muted)]">Phone: {order.phoneNumber || '—'}</p>
                    <p className="text-sm text-[var(--fg-muted)]">Transaction ID: {order.transactionId || '—'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--fg-light)] mb-2">Ordered items</p>
                  <div className="space-y-2">
                    {order.orderItems?.map((item, idx) => (
                      <div key={`${order._id}-${idx}`} className="flex items-center justify-between text-sm border-b border-[var(--border)] pb-2">
                        <span className="text-[var(--fg)]">{item.name} × {item.qty}</span>
                        <span className="text-[var(--accent)]">£{Number(item.price || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start xl:items-end gap-3">
                <span className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest px-3 py-2 border ${order.isDelivered ? 'text-green-700 border-green-300 bg-green-50' : 'text-[var(--accent)] border-[var(--accent)] bg-[var(--bg-muted)]'}`}>
                  <CheckCircle2 className="w-4 h-4" /> {order.isDelivered ? 'Delivery done' : 'Pending delivery'}
                </span>
                {!order.isDelivered ? (
                  <button onClick={() => markDelivered(order._id)} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1rem' }}>
                    <CheckCircle2 className="w-4 h-4" /> Mark delivery done
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-[var(--fg)]">Users</h2>
          {users.map((user) => (
            <div key={user._id} className="border border-[var(--border)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg text-[var(--fg)]">{user.name}</h3>
                <p className="text-sm text-[var(--fg-muted)]">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs uppercase tracking-widest ${user.isAdmin ? 'text-green-600' : 'text-[var(--fg-light)]'}`}>
                  {user.isAdmin ? 'Admin' : 'Customer'}
                </span>
                <button onClick={() => toggleAdmin(user)} className="btn-outline" style={{ width: 'auto', padding: '0.65rem 1rem' }}>
                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
