import { Link } from 'react-router-dom';
import { Product, ProductVariant } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  variants?: ProductVariant[];
}

export function ProductCard({ product, variants = [] }: ProductCardProps) {
  const minPrice = variants.length > 0
    ? Math.min(...variants.map(v => v.price))
    : 0;

  const maxPrice = variants.length > 0
    ? Math.max(...variants.map(v => v.price))
    : 0;

  const displayPrice =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

  const imageUrl = product.images[0] || 'https://via.placeholder.com/400x500.png?text=No+Image';

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden border-0 bg-gradient-card backdrop-blur-soft hover:shadow-lg transition-smooth">
        <CardContent className="p-0">
          {/* Image */}
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start p-4 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-1">{product.title}</h3>

          {/* Price */}
          <p className="text-lg font-bold text-primary">{displayPrice}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
