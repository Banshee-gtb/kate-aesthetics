import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { Product, ProductVariant } from '@/types';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Record<string, ProductVariant[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);

    // Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (products && products.length > 0) {
      setFeaturedProducts(products);

      // Fetch variants for these products
      const productIds = products.map(p => p.id);
      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);

      if (variantsData) {
        const variantsByProduct: Record<string, ProductVariant[]> = {};
        variantsData.forEach(variant => {
          if (!variantsByProduct[variant.product_id]) {
            variantsByProduct[variant.product_id] = [];
          }
          variantsByProduct[variant.product_id].push(variant);
        });
        setVariants(variantsByProduct);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-aesthetic">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-soft border border-white/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">New Collection Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Kate Aesthetic
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover curated fashion pieces with unique style variations. Shop modern aesthetic collections crafted for the contemporary you.
          </p>

          <Link to="/shop">
            <Button size="lg" className="rounded-full px-8">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gradient-aesthetic">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our handpicked selection of trending pieces
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted/50 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variants={variants[product.id] || []}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Curated Selection</h3>
              <p className="text-sm text-muted-foreground">
                Handpicked items that match your aesthetic
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Quick and easy guest checkout process
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Variants</h3>
              <p className="text-sm text-muted-foreground">
                Choose from various colors and sizes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
