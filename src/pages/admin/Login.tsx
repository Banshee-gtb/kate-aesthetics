import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { createAdminUser } from '@/lib/createAdmin';

export default function AdminLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Quick setup function - run this once to create the admin
  const setupAdmin = async () => {
    const result = await createAdminUser('mimi4vic@gmail.com', 'Marian12?');
    if (result.success) {
      toast({
        title: 'Admin setup complete',
        description: 'You can now login with your credentials',
      });
    } else {
      toast({
        title: 'Setup note',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // If user doesn't exist, try to create it
        if (error.message.includes('Invalid login credentials')) {
          console.log('User not found, attempting to create...');
          const setupResult = await createAdminUser(formData.email, formData.password);
          
          if (setupResult.success) {
            // Try login again
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            });
            
            if (retryError) throw retryError;
            
            // Check if user is admin
            const { data: adminData } = await supabase
              .from('admins')
              .select('email')
              .eq('email', formData.email)
              .single();

            if (!adminData) {
              await supabase.auth.signOut();
              throw new Error('Unauthorized: Admin access only');
            }

            login(retryData.user);
            toast({
              title: 'Login successful',
              description: 'Welcome to Mimi\'s Hub!',
            });
            navigate('/admin');
            return;
          }
        }
        throw error;
      }

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admins')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Admin access only');
      }

      // Update auth store with user data
      login(data.user);

      // Success toast
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });

      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-aesthetic flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mimi's Hub
          </h1>
          <p className="text-muted-foreground">Admin Dashboard</p>
        </div>

        <div className="p-8 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
                  placeholder="mimi4vic@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Button 
              onClick={setupAdmin} 
              variant="outline" 
              className="w-full"
              type="button"
            >
              First Time Setup
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click if this is your first login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
