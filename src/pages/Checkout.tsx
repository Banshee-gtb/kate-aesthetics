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

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + (item.variant.price * item.quantity);
    }, 0);
  };

  const calculateShipping = () => {
    // Get unique products and sum their shipping fees
    const uniqueProducts = new Map<string, number>();
    items.forEach(item => {
      if (!uniqueProducts.has(item.product.id)) {
        uniqueProducts.set(item.product.id, item.product.shipping_fee || 0);
      }
    });
    return Array.from(uniqueProducts.values()).reduce((sum, fee) => sum + fee, 0);
  };

  const getTotalWithShipping = () => {
    return calculateSubtotal() + calculateShipping();
  };

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
      const totalAmount = getTotalWithShipping();
      const subtotal = calculateSubtotal();
      const shipping = calculateShipping();

      // Build WhatsApp message
      let message = `🛍️ *NEW ORDER FROM KATE AESTHETIC*\n\n`;
      message += `📋 *Customer Details:*\n`;
      message += `Name: ${formData.name}\n`;
      message += `Phone: ${formData.phone}\n`;
      message += `Address: ${formData.address}\n`;
      message += `Payment: ${formData.paymentMethod === 'paystack' ? 'Card (Paystack)' : 'Mobile Money'}\n\n`;
      
      message += `📦 *Order Items:*\n`;
      items.forEach((item, index) => {
        message += `\n${index + 1}. ${item.product.title}\n`;
        message += `   Color: ${item.variant.color}\n`;
        message += `   Size: ${item.variant.size}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ₦${item.variant.price.toLocaleString()} each\n`;
        message += `   Subtotal: ₦${(item.variant.price * item.quantity).toLocaleString()}\n`;
        
        // Add product image URL if available
        if (item.product.images && item.product.images.length > 0) {
          message += `   Image: ${item.product.images[0]}\n`;
        }
      });
      
      message += `\n💰 *Payment Summary:*\n`;
      message += `Subtotal: ₦${subtotal.toLocaleString()}\n`;
      message += `Shipping: ₦${shipping.toLocaleString()}\n`;
      message += `*Total: ₦${totalAmount.toLocaleString()}*\n\n`;
      message += `⏰ Order placed: ${new Date().toLocaleString('en-NG')}\n\n`;
      message += `Please confirm this order and process payment. Thank you! 🙏`;

      // Create order in database (optional, for admin records)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          amount_paid: totalAmount,
          payment_method: formData.paymentMethod,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        // Continue anyway - WhatsApp is primary
      } else {
        // Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          variant_id: item.variant.id,
          quantity: item.quantity,
          price: item.variant.price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Order items error:', itemsError);
        }
      }

      // WhatsApp number (Nigeria format: remove leading 0, add 234)
      const whatsappNumber = '2349125568429';
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Clear cart and redirect to WhatsApp
      clearCart();
      
      toast({
        title: 'Redirecting to WhatsApp...',
        description: 'Please confirm your order with the admin to complete payment.',
      });

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Redirect home after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Order processing failed',
        description: error.message || 'Please try again',
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
                  {loading ? 'Processing...' : 'Send Order via WhatsApp'}
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

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    ₦{calculateSubtotal().toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span className="font-semibold">
                    ₦{calculateShipping().toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₦{getTotalWithShipping().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
