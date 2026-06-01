import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, SlidersHorizontal } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { apiUrl } from '../lib/api';

const mockData = [
  { _id: '1', name: 'The Obsidian Weekender', price: 850, category: 'Travel Bag', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80' },
  { _id: '2', name: 'Auric Accent Backpack', price: 420, category: 'Backpack', img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80' },
  { _id: '3', name: 'Midnight Tote', price: 315, category: 'Handbag', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80' },
  { _id: '4', name: 'The Minimalist Crossbody', price: 500, category: 'Crossbody', img: 'https://images.unsplash.com/photo-1590875958561-eb8364749969?auto=format&fit=crop&q=80' },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(apiUrl('/api/products'));
        setProducts(res.data?.length ? res.data : mockData);
      } catch {
        setProducts(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const all = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];
    return all;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleQuickAdd = (e, item) => {
    e.preventDefault();
    addToCart(
      {
        id: item._id,
        name: item.name,
        price: item.price,
        img: item.img || item.images?.[0],
        countInStock: item.countInStock || 5,
      },
      1,
    );
    navigate('/cart');
  };

  return (
    <div className="fade-in min-h-[65vh]">
      {/* Header */}
      <section className="px-6 md:px-16 py-12 md:py-16 border-b border-[var(--border)] bg-[var(--bg-muted)]">
        <p className="section-label mb-3">Collection</p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[var(--fg)] leading-none">
            All Products
          </h1>
          <button
            className="md:hidden inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--fg-muted)]"
            onClick={() => setMobileFiltersOpen((s) => !s)}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-14 flex flex-col md:flex-row gap-8 md:gap-10">
        {/* Sidebar */}
        <aside className={`md:w-64 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24 bg-[var(--bg-card)] border border-[var(--border)] p-5">
            <h3 className="section-label mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      activeCategory === cat
                        ? 'bg-[var(--bg-muted)] text-[var(--fg)] font-medium'
                        : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="animate-pulse bg-[var(--bg-card)] border border-[var(--border)]">
                  <div className="aspect-[4/5] bg-[var(--bg-muted)]" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-[var(--bg-muted)] w-3/4" />
                    <div className="h-4 bg-[var(--bg-muted)] w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-[var(--fg-muted)] font-light">
                  Showing <span className="font-medium text-[var(--fg)]">{filteredProducts.length}</span> items
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((item) => (
                  <article key={item._id} className="product-card group">
                    <Link to={`/products/${item._id}`}>
                      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-muted)]">
                        <img
                          src={item.img || item.images?.[0]}
                          alt={item.name}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        {item.category && (
                          <span className="badge absolute top-3 left-3">{item.category}</span>
                        )}
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      <Link to={`/products/${item._id}`}>
                        <h3 className="font-['Cormorant_Garamond'] text-2xl leading-tight text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[var(--accent)] font-light mt-1">£{Number(item.price).toLocaleString()}</p>
                      </Link>

                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        className="btn-outline mt-5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductList;
