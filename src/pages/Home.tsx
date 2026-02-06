import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { ValentineDiscount } from '@/components/ValentineDiscount';
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
      <ValentineDiscount />
      
      {/* Hero Section - Valentine's Theme */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-aesthetic">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-15" />
        
        {/* Floating hearts decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Heart className="absolute top-20 left-10 h-8 w-8 text-red-300/30 fill-red-300/30 animate-float-gentle" />
          <Heart className="absolute top-40 right-20 h-12 w-12 text-pink-300/20 fill-pink-300/20 animate-float-gentle" style={{ animationDelay: '1s' }} />
          <Heart className="absolute bottom-32 left-1/4 h-10 w-10 text-red-200/25 fill-red-200/25 animate-float-gentle" style={{ animationDelay: '2s' }} />
          <Heart className="absolute bottom-20 right-1/3 h-6 w-6 text-pink-400/30 fill-pink-400/30 animate-float-gentle" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-soft border-2 border-white/40 valentine-shimmer">
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-heart-beat" />
            <span className="text-sm font-semibold text-red-600">Valentine's Special Collection 💝</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-glow-pulse">
            Kate Aesthetic
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 mb-4 max-w-2xl mx-auto font-medium">
            💗 Fall in Love with Our Curated Collection 💗
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover pieces that make you feel special. Perfect gifts for your loved ones this Valentine's season.
          </p>

          <Link to="/shop">
            <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-glow-pulse">
              <Heart className="mr-2 h-5 w-5 fill-white" />
              Shop Valentine's Gifts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gradient-aesthetic">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-red-500 fill-red-500 animate-heart-beat" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Valentine's Featured Collection</h2>
              <Heart className="h-8 w-8 text-pink-500 fill-pink-500 animate-heart-beat" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              🌹 Handpicked with love, perfect for gifting 🌹
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted/50 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center animate-glow-pulse">
                <Heart className="h-7 w-7 text-red-500 fill-red-500 animate-heart-beat" />
              </div>
              <h3 className="font-semibold mb-2 text-red-600">💝 Curated with Love</h3>
              <p className="text-sm text-muted-foreground">
                Each piece selected to make someone feel special
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 flex items-center justify-center animate-glow-pulse" style={{ animationDelay: '0.5s' }}>
                <ArrowRight className="h-7 w-7 text-pink-500" />
              </div>
              <h3 className="font-semibold mb-2 text-pink-600">🎁 Perfect Gift Shopping</h3>
              <p className="text-sm text-muted-foreground">
                Quick checkout for last-minute Valentine's gifts
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center animate-glow-pulse" style={{ animationDelay: '1s' }}>
                <Heart className="h-7 w-7 text-pink-500 fill-pink-500 animate-heart-beat" style={{ animationDelay: '0.3s' }} />
              </div>
              <h3 className="font-semibold mb-2 text-red-600">💖 Made to Impress</h3>
              <p className="text-sm text-muted-foreground">
                Quality pieces in multiple colors and sizes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
