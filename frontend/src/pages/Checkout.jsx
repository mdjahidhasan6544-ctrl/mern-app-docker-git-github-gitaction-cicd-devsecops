import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { apiUrl } from '../lib/api';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCartStore();
    const { userInfo } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Form state
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('Dhaka');
    const [postalCode, setPostalCode] = useState('1207');
    const [country, setCountry] = useState('Bangladesh');
    const [paymentMethod, setPaymentMethod] = useState('Digital Payment (manual)');
    const [transactionId, setTransactionId] = useState('');

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        try {
            const config = userInfo ? {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            } : {};

            await axios.post(apiUrl('/api/orders'), {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.img,
                    price: item.price,
                    product: item.id?.length === 24 ? item.id : undefined,
                })),
                shippingAddress: { address, city, postalCode, country },
                guestEmail: email,
                phoneNumber,
                transactionId,
                paymentMethod,
                itemsPrice: getCartTotal(),
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: getCartTotal()
            }, config);

            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        } catch (error) {
            console.error('Checkout error', error);
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 fade-in">
                <div className="w-16 h-16 border border-[var(--accent)] text-[var(--accent)] flex items-center justify-center mb-8">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-4xl font-serif mb-4 text-[var(--fg)] text-center">Order Confirmed</h1>
                <p className="text-[var(--fg-muted)] font-light text-center max-w-md text-sm leading-relaxed tracking-wide">
                    Thank you. The transaction is complete. An envoy will contact you shortly with tracking details for your pieces.
                </p>
                <Link to="/products" className="mt-12 text-[10px] text-[var(--accent)] uppercase tracking-widest border-b border-[var(--accent)] pb-1 hover:opacity-70 transition-colors">
                    Return to Atelier
                </Link>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-16 py-10 md:py-14 pb-28 md:pb-14 fade-in min-h-[60vh] flex flex-col-reverse md:flex-row gap-10 md:gap-12 max-w-7xl mx-auto">
            <div className="w-full md:w-1/2">
                <p className="section-label mb-3">Secure checkout</p>
                <h1 className="text-4xl md:text-5xl font-serif mb-8 text-[var(--fg)]">Checkout</h1>
                <form onSubmit={handleCheckout} className="flex flex-col gap-6">
                    <h2 className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest mt-2">Shipping Information</h2>
                    <input 
                        required 
                        type="text" 
                        placeholder="Full Address" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input-field" 
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email Address" className="input-field" />
                        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required type="tel" placeholder="Phone Number" className="input-field" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={city} onChange={(e) => setCity(e.target.value)} required type="text" placeholder="City" className="input-field" />
                        <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required type="text" placeholder="Postal Code" className="input-field" />
                    </div>
                    <input value={country} onChange={(e) => setCountry(e.target.value)} required type="text" placeholder="Country" className="input-field" />
                    
                    <h2 className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest mt-8">Payment Method</h2>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-3 border border-[var(--border)] p-5 cursor-pointer has-[:checked]:border-[var(--accent)] bg-[var(--bg-card)] transition-colors">
                            <input type="radio" name="payment" value="Digital Payment (manual)" checked={paymentMethod === 'Digital Payment (manual)'} onChange={() => setPaymentMethod('Digital Payment (manual)')} className="accent-[#C0C6C8]" />
                            <span className="font-light text-sm text-[var(--fg)] tracking-wide">Digital Payment (manual)</span>
                        </label>
                        <label className="flex items-center gap-3 border border-[var(--border)] p-5 cursor-pointer has-[:checked]:border-[var(--accent)] bg-[var(--bg-card)] transition-colors">
                            <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-[#C0C6C8]" />
                            <span className="font-light text-sm text-[var(--fg)] tracking-wide">Cash on Delivery</span>
                        </label>
                    </div>

                    {paymentMethod === 'Digital Payment (manual)' && (
                        <div className="border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-[var(--fg)]">Manual digital payment</p>
                                <p className="text-xs text-[var(--fg-muted)] font-light mt-1">
                                    Send payment manually using your preferred UK payment method, then enter the transaction ID below for verification.
                                </p>
                            </div>
                            <input
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                required
                                type="text"
                                placeholder="Transaction ID / Reference Number"
                                className="input-field"
                            />
                        </div>
                    )}

                    <button 
                        disabled={isProcessing} 
                        className="btn-primary mt-8"
                    >
                        {isProcessing ? 'Authorizing...' : 'Complete Payment'}
                    </button>
                </form>
            </div>

            <div className="w-full md:w-1/2 bg-[var(--bg-card)] p-6 md:p-8 h-fit border border-[var(--border)] md:sticky md:top-24">
                <h3 className="font-serif text-2xl mb-6 border-b border-[var(--border)] pb-4 text-[var(--fg)]">Order Dossier</h3>
                <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto hide-scrollbar">
                    {cartItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-4 items-center">
                            <img src={item.img} className="w-14 h-18 object-cover bg-[var(--bg-muted)]" />
                            <div className="flex-grow pr-2">
                                <h4 className="font-serif text-[var(--fg)] text-sm md:text-base">{item.name}</h4>
                                <p className="text-xs font-light text-[var(--fg-muted)] mt-1">Qty: {item.qty}</p>
                            </div>
                            <p className="font-light text-[var(--accent)] text-sm">£{Number(item.price).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center text-[var(--fg)]">
                    <span className="text-sm font-light uppercase tracking-widest">Total</span>
                    <span className="text-lg text-[var(--accent)]">£{Number(getCartTotal()).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
