import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { apiUrl } from '../lib/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(apiUrl('/api/products'));
        const found = res.data.find((item) => item._id === id);
        if (found) {
          setProduct(found);
          setSelectedImage(found.images?.[0] || found.img);
          return;
        }
      } catch {
        // fall back below
      }

      const fallback = {
        _id: id,
        name: 'The Obsidian Weekender',
        price: 850,
        category: 'Travel Bag',
        material: 'Italian Full-Grain Leather',
        color: 'Obsidian',
        description:
          'Crafted from premium Italian leather, this travel companion ages beautifully. Features solid brass hardware and dedicated compartments for modern essentials.',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80',
        ],
        countInStock: 5,
      };

      setProduct(fallback);
      setSelectedImage(fallback.images[0]);
    };

    loadProduct();
  }, [id]);

  const handleAdd = () => {
    addToCart(
      {
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        img: product.images?.[0] || selectedImage,
        countInStock: product.countInStock,
      },
      qty,
    );
    navigate('/cart');
  };

  if (!product) return <div className="px-6 md:px-16 py-20">Loading...</div>;

  const gallery = product.images?.length ? product.images : [product.img].filter(Boolean);

  return (
    <div className="fade-in px-6 md:px-16 py-10 md:py-14 pb-28 md:pb-16 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-start">
        <div>
          <div className="bg-[var(--bg-muted)] aspect-[4/5] overflow-hidden mb-4">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square overflow-hidden border ${selectedImage === img ? 'border-[var(--accent)]' : 'border-[var(--border)]'}`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <p className="section-label mb-3">{product.category || 'Heritage Line'}</p>
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl leading-none text-[var(--fg)] mb-3">
            {product.name}
          </h1>
          <p className="text-2xl md:text-3xl text-[var(--accent)] font-light mb-6">
            £{Number(product.price).toLocaleString()}
          </p>
          <p className="text-[var(--fg-muted)] font-light leading-relaxed text-sm md:text-base mb-8 max-w-xl">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4">
              <p className="text-[var(--fg-light)] uppercase tracking-widest text-[10px] mb-1">Material</p>
              <p className="text-[var(--fg)]">{product.material || 'Premium Leather'}</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4">
              <p className="text-[var(--fg-light)] uppercase tracking-widest text-[10px] mb-1">Color</p>
              <p className="text-[var(--fg)]">{product.color || 'Obsidian'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end mb-8">
            <div className="w-full sm:w-32">
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-light)] mb-2">Quantity</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="input-field border border-[var(--border)] px-3 py-3 bg-[var(--bg-card)]"
              >
                {[...Array(product.countInStock || 1).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <button onClick={handleAdd} className="btn-primary">
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[var(--fg-muted)]">
            <div className="flex items-start gap-3 border border-[var(--border)] p-4 bg-[var(--bg-card)]">
              <Truck className="w-4 h-4 mt-0.5 text-[var(--accent)]" />
              <div>
                <p className="text-[var(--fg)] font-medium">Fast delivery</p>
                <p className="font-light">Usually dispatched within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border border-[var(--border)] p-4 bg-[var(--bg-card)]">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-[var(--accent)]" />
              <div>
                <p className="text-[var(--fg)] font-medium">Craft guarantee</p>
                <p className="font-light">Premium materials, carefully finished.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
