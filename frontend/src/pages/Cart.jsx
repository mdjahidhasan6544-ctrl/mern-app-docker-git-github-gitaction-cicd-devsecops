import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal, addToCart } = useCartStore();
    const navigate = useNavigate();

    return (
        <div className="px-6 md:px-16 py-10 md:py-14 pb-28 md:pb-14 fade-in min-h-[60vh] max-w-7xl mx-auto">
            <div className="mb-10">
                <p className="section-label mb-3">Your selection</p>
                <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[var(--fg)]">Shopping Bag</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 border border-[var(--border)] bg-[var(--bg-card)] px-6">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-6 text-[var(--accent)]" />
                    <p className="text-[var(--fg-muted)] mb-8 font-light text-sm uppercase tracking-widest">Your bag is empty.</p>
                    <Link to="/products"><button className="btn-primary" style={{ width: 'auto' }}>Continue Shopping</button></Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-12">
                    <div className="flex flex-col gap-6">
                        {cartItems.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="grid grid-cols-[96px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-6 border border-[var(--border)] bg-[var(--bg-card)] p-4 md:p-5">
                                <img src={item.img} alt={item.name} className="w-24 h-32 md:w-[140px] md:h-[180px] object-cover bg-[var(--bg-muted)]" />
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[var(--fg)] leading-tight">{item.name}</h3>
                                            <p className="text-[var(--fg-light)] font-light text-xs mt-1 uppercase tracking-widest">Signature collection</p>
                                        </div>
                                        <p className="text-lg text-[var(--accent)] font-light">£{Number(item.price).toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-end flex-grow mt-6 gap-4">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-light)] mb-2">Quantity</label>
                                            <select 
                                                value={item.qty} 
                                                onChange={(e) => addToCart(item, Number(e.target.value))}
                                                className="border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-[var(--fg)] outline-none"
                                            >
                                                {[1,2,3,4,5].map(x => (
                                                    <option key={x} value={x}>{x}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-[var(--fg-light)] hover:text-red-400 transition-colors pb-1">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="lg:sticky lg:top-24 w-full bg-[var(--bg-card)] p-6 md:p-8 h-fit border border-[var(--border)]">
                        <h3 className="font-['Cormorant_Garamond'] text-3xl mb-6 text-[var(--fg)]">Order Summary</h3>
                        <div className="flex justify-between text-[var(--fg-muted)] mb-4 font-light text-sm">
                            <span>Subtotal</span>
                            <span>£{Number(getCartTotal()).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[var(--fg-muted)] mb-4 font-light text-sm">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between text-[var(--fg-muted)] border-b border-[var(--border)] pb-4 mb-4 font-light text-sm">
                            <span>Estimated delivery</span>
                            <span>2–4 days</span>
                        </div>
                        <div className="flex justify-between font-medium text-xl mb-8 text-[var(--fg)]">
                            <span>Total</span>
                            <span className="text-[var(--accent)]">£{Number(getCartTotal()).toLocaleString()}</span>
                        </div>
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="btn-primary"
                        >
                            Checkout <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
