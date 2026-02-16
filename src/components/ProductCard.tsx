import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  variants?: ProductVariant[];
}

export function ProductCard({ product, variants = [] }: ProductCardProps) {
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);

  const minPrice = variants.length > 0
    ? Math.min(...variants.map(v => v.price))
    : product.base_price || 0;

  const maxPrice = variants.length > 0
    ? Math.max(...variants.map(v => v.price))
    : product.base_price || 0;

  const displayPrice =
    minPrice === maxPrice
      ? `₦${minPrice.toLocaleString()}`
      : `₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`;

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://via.placeholder.com/400x500.png?text=No+Image';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If no variants, create a default variant using base_price
    if (!variants || variants.length === 0) {
      if (!product.base_price || product.base_price === 0) {
        toast({
          title: 'Price not set',
          description: 'This product is not available for purchase yet.',
          variant: 'destructive',
        });
        return;
      }

      // Create a virtual default variant
      const defaultVariant: ProductVariant = {
        id: `default-${product.id}`,
        product_id: product.id,
        color: 'Default',
        size: 'Standard',
        price: product.base_price,
        in_stock: true,
        created_at: new Date().toISOString(),
      };

      addItem(product, defaultVariant, 1);
      toast({
        title: '✓ Added to cart',
        description: product.title,
      });
      return;
    }

    // Find first in-stock variant
    const availableVariant = variants.find(v => v.in_stock) || variants[0];
    
    if (!availableVariant) {
      toast({
        title: 'Out of stock',
        description: 'This product is currently unavailable.',
        variant: 'destructive',
      });
      return;
    }

    // Add variant to cart
    addItem(product, availableVariant, 1);
    toast({
      title: '✓ Added to cart',
      description: `${product.title} (${availableVariant.color}, ${availableVariant.size})`,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden border bg-gradient-card backdrop-blur-soft hover:shadow-lg transition-smooth hover:scale-105 h-full flex flex-col">
        <CardContent className="p-0 relative">
          {/* Image */}
          <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-muted relative">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 flex-1">
          {/* Title */}
          <h3 className="font-semibold text-xs sm:text-base line-clamp-1 w-full">{product.title}</h3>

          {/* Description - Hide on mobile for better spacing */}
          {product.description && (
            <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2 w-full">
              {product.description}
            </p>
          )}

          {/* Price */}
          <p className="text-sm sm:text-lg font-bold text-primary">{displayPrice}</p>

          {/* Tags - Show only on larger screens */}
          {product.tags && product.tags.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1 w-full">
              {product.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            size="sm"
            className="w-full mt-1 sm:mt-2 h-8 sm:h-9 text-xs sm:text-sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
