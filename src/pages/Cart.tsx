import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-aesthetic flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-aesthetic py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div
              key={item.variant.id}
              className="flex gap-4 p-4 rounded-lg bg-gradient-card backdrop-blur-soft"
            >
              {/* Image */}
              <img
                src={item.product.images[0] || 'https://via.placeholder.com/100'}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded-lg"
              />

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.product.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.variant.color} / {item.variant.size}
                </p>
                <p className="font-bold text-primary">${item.variant.price.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.variant.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>

          <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
