import { useEffect, useState } from 'react';
import { Package, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types';

export function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (id, title),
            variant:product_variants (id, color, size, price)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error loading orders',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Order updated',
        description: `Order status changed to ${status}.`,
      });

      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error updating order',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and shipments</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Orders will appear here when customers make purchases.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full w-fit ${
                        order.status === 'completed'
                          ? 'bg-green-500/10 text-green-500'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Product Names Summary */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="text-sm font-medium text-foreground">
                      🛍️ {order.order_items.map((item: any) => item.product?.title || 'Unknown').join(', ')}
                    </div>
                  )}
                  
                  <p className="text-sm font-semibold text-primary">
                    💰 Total: ₦{order.amount_paid.toLocaleString()}
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    📞 {order.customer_phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📍 {order.customer_address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    💳 {order.payment_method === 'paystack' ? 'Paystack' : 'Mobile Money'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ⏰ {new Date(order.created_at).toLocaleString('en-NG')}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="gap-2 flex-1 md:flex-none"
                  >
                    <Eye className="h-4 w-4" />
                    {selectedOrder?.id === order.id ? 'Hide' : 'View'}
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="gap-2 flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
                    >
                      <Check className="h-4 w-4" />
                      Ship
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="gap-2 flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>

              {selectedOrder?.id === order.id && order.order_items && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <h4 className="font-semibold mb-2">Order Items:</h4>
                  {order.order_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 rounded bg-background/50 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.product?.title || 'Unknown Product'}</p>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            {item.variant.color} - {item.variant.size}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
