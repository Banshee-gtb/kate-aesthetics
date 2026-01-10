import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, FolderTree } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  products: number;
  orders: number;
  users: number;
  categories: number;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    orders: 0,
    users: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        users: usersRes.count || 0,
        categories: categoriesRes.count || 0,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error loading stats',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      color: 'from-blue-500 to-purple-500',
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Customers',
      value: stats.users,
      icon: Users,
      color: 'from-pink-500 to-orange-500',
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: FolderTree,
      color: 'from-orange-500 to-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Navigate to specific panels to view detailed information.
            </p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Use the sidebar to manage products, orders, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
