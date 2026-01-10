import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/stores/cartStore';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'paystack' as 'paystack' | 'mobile_money',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart first.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          amount_paid: getTotalPrice(),
          payment_method: formData.paymentMethod,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // In a real implementation, you would integrate with Paystack here
      // For now, we'll just mark the order as paid

      toast({
        title: 'Order placed successfully!',
        description: `Order #${order.id.substring(0, 8)} has been created. You will receive a WhatsApp notification shortly.`,
      });

      clearCart();
      navigate('/');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Order failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-aesthetic flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-aesthetic py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="paystack"
                        checked={formData.paymentMethod === 'paystack'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: 'paystack' })}
                        className="text-primary"
                      />
                      <span>Paystack (Card Payment)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="mobile_money"
                        checked={formData.paymentMethod === 'mobile_money'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: 'mobile_money' })}
                        className="text-primary"
                      />
                      <span>Mobile Money</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.variant.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.title} ({item.variant.color}, {item.variant.size}) x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₦{(item.variant.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₦{getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
