import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, RefreshCcw, ShieldCheck, Headphones } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { apiUrl } from '../lib/api';

const fallbackFeaturedBags = [
  {
    _id: '1',
    name: 'The Obsidian Weekender',
    price: 850,
    category: 'Travel Bag',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: '2',
    name: 'Auric Accent Backpack',
    price: 420,
    category: 'Backpack',
    images: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: '3',
    name: 'Midnight Tote',
    price: 315,
    category: 'Handbag',
    images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80'],
  },
  {
    _id: '4',
    name: 'The Minimalist Crossbody',
    price: 500,
    category: 'Crossbody',
    images: ['https://images.unsplash.com/photo-1590875958561-eb8364749969?auto=format&fit=crop&w=800&q=80'],
  },
];

const categories = [
  { label: 'Travel Bags', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  { label: 'Backpacks',   img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80' },
  { label: 'Handbags',    img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80' },
];

const perks = [
  { icon: <Truck className="w-5 h-5" />,       title: 'Free Shipping',    desc: 'On all orders over £1,000' },
  { icon: <RefreshCcw className="w-5 h-5" />,   title: 'Easy Returns',     desc: '30-day hassle-free returns' },
  { icon: <ShieldCheck className="w-5 h-5" />,  title: 'Authenticity',     desc: '100% genuine leather goods' },
  { icon: <Headphones className="w-5 h-5" />,   title: '24/7 Support',     desc: 'Dedicated concierge service' },
];

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const [featuredBags, setFeaturedBags] = useState(fallbackFeaturedBags);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const res = await axios.get(apiUrl('/api/products'));
        if (Array.isArray(res.data) && res.data.length > 0) {
          setFeaturedBags(res.data.slice(0, 4));
        } else {
          setFeaturedBags(fallbackFeaturedBags);
        }
      } catch {
        setFeaturedBags(fallbackFeaturedBags);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleQuickAdd = (e, item) => {
    e.preventDefault();
    addToCart({ id: item._id || item.id, name: item.name, price: item.price, img: item.img || item.images?.[0] }, 1);
    navigate('/cart');
  };

  return (
    <div className="fade-in">

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden noise-overlay">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] ease-out scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-16 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <p className="section-label text-[var(--accent-light)] mb-5 fade-in stagger-1">
              New Collection — Spring 2026
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl md:text-8xl font-light text-white leading-[1.05] mb-6 fade-in stagger-2">
              The Art of<br />
              <em className="italic">Carrying</em>
            </h1>
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-md mb-10 fade-in stagger-3">
              Meticulous craftsmanship meets modern utility. Discover the Craftweave collection — built for those who move with intention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fade-in stagger-4">
              <Link to="/products">
                <button className="btn-accent" style={{ width: 'auto', padding: '1rem 2.5rem' }}>
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/products">
                <button
                  className="btn-outline"
                  style={{ width: 'auto', padding: '1rem 2.5rem', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                >
                  View Lookbook
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 z-10 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-12 bg-white/50 animate-pulse" />
          <span className="text-white text-[0.6rem] tracking-[0.2em] uppercase rotate-90 origin-center mt-4">Scroll</span>
        </div>
      </section>

      {/* ── Perks strip ── */}
      <section className="bg-[var(--bg-muted)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-[var(--border)]">
          {perks.map((p, i) => (
            <div key={i} className="flex items-center gap-4 md:px-8 first:pl-0 last:pr-0">
              <span className="text-[var(--accent)] flex-shrink-0">{p.icon}</span>
              <div>
                <p className="text-xs font-semibold text-[var(--fg)] tracking-wide">{p.title}</p>
                <p className="text-[0.7rem] text-[var(--fg-muted)] font-light mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Browse by style</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light text-[var(--fg)]">
              Shop Categories
            </h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors">
            All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Link key={i} to="/products" className="group relative overflow-hidden aspect-[3/4] block">
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="section-label text-[var(--accent-light)] mb-1">{cat.label}</p>
                <span className="flex items-center gap-2 text-white text-xs font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-[var(--bg-muted)] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-2">Handpicked for you</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light text-[var(--fg)]">
                Curated Pieces
              </h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile: horizontal scroll | Desktop: grid */}
          <div className="flex md:grid md:grid-cols-4 overflow-x-auto hide-scrollbar gap-4 md:gap-6 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-4 md:pb-0">
            {featuredBags.map((item, i) => (
              <div
                key={item._id || item.id}
                className={`product-card min-w-[72vw] sm:min-w-[50vw] md:min-w-0 flex-none snap-start fade-in`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <Link to={`/products/${item._id || item.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-muted)]">
                    <img
                      src={item.img || item.images?.[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge">{item.category}</span>
                    </div>
                  </div>
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <Link to={`/products/${item._id || item.id}`}>
                    <h3 className="font-['Cormorant_Garamond'] text-xl font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-[var(--accent)] font-light mt-1 text-sm">£{item.price.toLocaleString()}</p>
                  </Link>
                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className="btn-outline mt-4"
                    style={{ padding: '0.6rem 1rem' }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile "View All" */}
          <div className="mt-8 md:hidden">
            <Link to="/products">
              <button className="btn-primary">View All Products</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Editorial Banner ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 md:py-28">
        <div className="relative overflow-hidden bg-[var(--bg-dark)] min-h-[320px] md:min-h-[420px] flex items-center noise-overlay">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80')" }}
          />
          <div className="relative z-10 px-8 md:px-16 py-12 max-w-xl">
            <p className="section-label text-[var(--accent-light)] mb-4">Heritage Line</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl font-light text-white leading-tight mb-6">
              Crafted to<br /><em>Last a Lifetime</em>
            </h2>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-8 max-w-sm">
              Every stitch, every clasp, every seam — made with intention. Our Heritage Line uses only full-grain Italian leather and solid brass hardware.
            </p>
            <Link to="/products">
              <button className="btn-accent" style={{ width: 'auto', padding: '0.875rem 2rem' }}>
                Discover Heritage <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
