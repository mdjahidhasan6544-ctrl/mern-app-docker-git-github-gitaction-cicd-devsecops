import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Globe, Send } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[var(--bg-dark)] text-[var(--bg)] mt-24">
    {/* Top strip */}
    <div className="border-b border-white/10 px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <p className="section-label text-[var(--accent-light)] mb-2">Stay in the loop</p>
        <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl font-light text-white">
          New arrivals, exclusive drops.
        </h3>
      </div>
      <div className="flex w-full md:w-auto max-w-sm border-b border-white/30 focus-within:border-[var(--accent-light)] transition-colors pb-2">
        <input
          type="email"
          placeholder="Your email address"
          className="bg-transparent outline-none text-sm text-white placeholder-white/40 font-light flex-1 min-w-0"
        />
        <button className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[var(--accent-light)] hover:text-white transition-colors ml-4 whitespace-nowrap">
          Subscribe
        </button>
      </div>
    </div>

    {/* Main grid */}
    <div className="px-6 md:px-16 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
      {/* Brand */}
      <div className="col-span-2 md:col-span-1">
        <h4 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] font-semibold mb-4 text-white">
          CRAFTWEAVE
        </h4>
        <p className="text-xs text-white/50 leading-relaxed max-w-xs font-light">
          Elevating everyday carry through meticulous craftsmanship and timeless aesthetic. Made for those who demand both form and function.
        </p>
        <div className="flex gap-4 mt-6">
          <a href="#" className="text-white/40 hover:text-[var(--accent-light)] transition-colors"><Camera className="w-4 h-4" /></a>
          <a href="#" className="text-white/40 hover:text-[var(--accent-light)] transition-colors"><Send className="w-4 h-4" /></a>
          <a href="#" className="text-white/40 hover:text-[var(--accent-light)] transition-colors"><Globe className="w-4 h-4" /></a>
        </div>
      </div>

      {/* Shop */}
      <div>
        <h5 className="section-label text-[var(--accent-light)] mb-5">Shop</h5>
        <ul className="space-y-3 text-sm font-light text-white/50">
          <li><Link to="/products" className="hover:text-white transition-colors">All Bags</Link></li>
          <li><a href="#" className="hover:text-white transition-colors">Backpacks</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Handbags</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Travel Bags</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Crossbody</a></li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h5 className="section-label text-[var(--accent-light)] mb-5">Support</h5>
        <ul className="space-y-3 text-sm font-light text-white/50">
          <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
          <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h5 className="section-label text-[var(--accent-light)] mb-5">Company</h5>
        <ul className="space-y-3 text-sm font-light text-white/50">
          <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Craftsmanship</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/10 px-6 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-[0.65rem] text-white/30 tracking-widest uppercase">
        © {new Date().getFullYear()} Craftweave. All rights reserved.
      </p>
      <div className="flex gap-6">
        <a href="#" className="text-[0.65rem] text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors">Privacy</a>
        <a href="#" className="text-[0.65rem] text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors">Terms</a>
        <button type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="text-[0.65rem] text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors">Cookies</button>
      </div>
    </div>
  </footer>
);

export default Footer;
