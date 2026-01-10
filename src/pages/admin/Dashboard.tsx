import { useEffect, useState } from 'react';
import { Package, ShoppingBag, FolderTree, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0,
    users: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [productsRes, ordersRes, categoriesRes, usersRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      products: productsRes.count || 0,
      orders: ordersRes.count || 0,
      categories: categoriesRes.count || 0,
      users: usersRes.count || 0,
    });
  };

  const statCards = [
    {
      icon: Package,
      label: 'Products',
      value: stats.products,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: ShoppingBag,
      label: 'Orders',
      value: stats.orders,
      color: 'bg-secondary/10 text-secondary',
    },
    {
      icon: FolderTree,
      label: 'Categories',
      value: stats.categories,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Users,
      label: 'Users',
      value: stats.users,
      color: 'bg-secondary/10 text-secondary',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Kate! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <p className="text-muted-foreground">
          Use the sidebar to navigate to Products, Categories, Orders, or Settings.
        </p>
      </div>
    </div>
  );
}
