import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Home as HomeIcon, Grid, Menu, X } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { cartItems } = useCartStore();
  const { userInfo, logout } = useAuthStore();
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    closeMenu();
    logout();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Desktop / Top Nav ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 h-16 md:h-20">
          {/* Left links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/products"
              className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/products"
              className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              Collections
            </Link>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-['Cormorant_Garamond'] text-xl md:text-2xl font-semibold tracking-[0.25em] text-[var(--fg)] whitespace-nowrap"
          >
            CRAFTWEAVE
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-5 ml-auto">
            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-5">
              {userInfo?.isAdmin ? (
                <Link
                  to="/admin"
                  className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--accent)] hover:text-[var(--fg)] transition-colors"
                >
                  Admin
                </Link>
              ) : null}
              {userInfo ? (
                <button
                  onClick={logout}
                  className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="md:hidden glass-nav border-t border-[var(--border)] px-6 py-6 flex flex-col gap-5">
            <Link to="/products" onClick={closeMenu} className="text-sm font-semibold tracking-widest uppercase text-[var(--fg)]">Shop</Link>
            <Link to="/products" onClick={closeMenu} className="text-sm font-semibold tracking-widest uppercase text-[var(--fg)]">Collections</Link>
            <hr className="border-[var(--border)]" />
            {userInfo ? (
              <button onClick={handleLogout} className="text-sm font-semibold tracking-widest uppercase text-[var(--fg-muted)] text-left">Logout</button>
            ) : (
              <>
                {userInfo?.isAdmin ? <Link to="/admin" onClick={closeMenu} className="text-sm font-semibold tracking-widest uppercase text-[var(--accent)]">Admin</Link> : null}
                <Link to="/login" onClick={closeMenu} className="text-sm font-semibold tracking-widest uppercase text-[var(--fg)]">Login</Link>
                <Link to="/register" onClick={closeMenu} className="text-sm font-semibold tracking-widest uppercase text-[var(--accent)]">Create Account</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div className="h-16 md:h-20" />

      {/* ── Mobile Bottom Nav ── */}
      <nav className="glass-nav fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 md:hidden border-t border-[var(--border)]">
        <Link to="/" className="flex flex-col items-center gap-1 text-[var(--fg-light)] hover:text-[var(--accent)] transition-colors">
          <HomeIcon className="w-5 h-5" />
          <span className="text-[9px] uppercase font-semibold tracking-widest">Home</span>
        </Link>
        <Link to="/products" className="flex flex-col items-center gap-1 text-[var(--fg-light)] hover:text-[var(--accent)] transition-colors">
          <Grid className="w-5 h-5" />
          <span className="text-[9px] uppercase font-semibold tracking-widest">Shop</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center gap-1 text-[var(--fg-light)] hover:text-[var(--accent)] transition-colors relative">
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 right-3 bg-[var(--accent)] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          )}
          <span className="text-[9px] uppercase font-semibold tracking-widest">Bag</span>
        </Link>
        {userInfo ? (
          <button onClick={logout} className="flex flex-col items-center gap-1 text-[var(--fg-light)] hover:text-[var(--accent)] transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[9px] uppercase font-semibold tracking-widest">Logout</span>
          </button>
        ) : (
          <Link to="/login" className="flex flex-col items-center gap-1 text-[var(--fg-light)] hover:text-[var(--accent)] transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[9px] uppercase font-semibold tracking-widest">Login</span>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;
