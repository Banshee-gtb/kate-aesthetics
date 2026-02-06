import { useEffect, useState } from 'react';
import { Search, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { ValentineDiscount } from '@/components/ValentineDiscount';
import { supabase } from '@/lib/supabase';
import { Product, ProductVariant, Category } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Record<string, ProductVariant[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data: productsData } = await query;

    if (productsData && productsData.length > 0) {
      // Client-side filtering for search (includes tags, title, description)
      let filteredProducts = productsData;
      
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredProducts = productsData.filter(product => {
          // Search in title
          const titleMatch = product.title?.toLowerCase().includes(searchLower);
          
          // Search in description
          const descMatch = product.description?.toLowerCase().includes(searchLower);
          
          // Search in tags (array)
          const tagsMatch = product.tags?.some((tag: string) => 
            tag.toLowerCase().includes(searchLower)
          );
          
          return titleMatch || descMatch || tagsMatch;
        });
      }

      setProducts(filteredProducts);

      if (filteredProducts.length > 0) {
        const productIds = filteredProducts.map(p => p.id);
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
    } else {
      setProducts([]);
      setVariants({});
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-aesthetic py-8 px-4">
      <ValentineDiscount />
      
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-red-500 fill-red-500 animate-heart-beat" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Valentine's Shop</h1>
            <Heart className="h-10 w-10 text-pink-500 fill-pink-500 animate-heart-beat" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-muted-foreground text-lg">💝 Find the perfect gift for your special someone 💝</p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative valentine-shimmer">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
            <Input
              type="text"
              placeholder="🔍 Search for the perfect gift..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-soft border-2 border-pink-200 focus:border-red-400 transition-colors"
            />
          </div>

          {/* Categories Dropdown */}
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
          >
            <SelectTrigger className="bg-white/90 backdrop-blur-soft border-2 border-pink-200 focus:border-red-400 transition-colors">
              <SelectValue placeholder="💕 Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">💖 All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  🌹 {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-muted/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                variants={variants[product.id] || []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
