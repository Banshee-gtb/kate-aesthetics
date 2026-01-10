import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, variant, quantity) => {
        const items = get().items;
        const existingIndex = items.findIndex(item => item.variant.id === variant.id);
        
        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, { product, variant, quantity }] });
        }
      },
      
      removeItem: (variantId) => {
        set({ items: get().items.filter(item => item.variant.id !== variantId) });
      },
      
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        const items = get().items;
        const index = items.findIndex(item => item.variant.id === variantId);
        
        if (index > -1) {
          const newItems = [...items];
          newItems[index].quantity = quantity;
          set({ items: newItems });
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + (item.variant.price * item.quantity);
        }, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'kate-aesthetic-cart',
    }
  )
);
