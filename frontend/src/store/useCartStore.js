import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  
  addToCart: (product, qty) => {
    const item = { ...product, qty };
    set((state) => {
      const existItemStr = state.cartItems.find((x) => x.id === item.id);
      const nextState = existItemStr
        ? {
          cartItems: state.cartItems.map((x) =>
            x.id === existItemStr.id ? item : x
          ),
        }
        : { cartItems: [...state.cartItems, item] };

      localStorage.setItem('cartItems', JSON.stringify(nextState.cartItems));
      return nextState;
    });
  },
  
  removeFromCart: (id) => {
    set((state) => {
      const nextItems = state.cartItems.filter((x) => x.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(nextItems));
      return {
        cartItems: nextItems,
      };
    });
  },
  
  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [] });
  },

  getCartTotal: () => {
    return Number(get().cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
  }
}));

export default useCartStore;
