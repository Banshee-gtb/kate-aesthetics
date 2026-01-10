import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Product, ProductVariant } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/hooks/use-toast';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productData) {
      setProduct(productData);

      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .eq('in_stock', true);

      if (variantsData && variantsData.length > 0) {
        setVariants(variantsData);
        setSelectedVariant(variantsData[0]);
      }
    }

    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem(product, selectedVariant, quantity);
    toast({
      title: 'Added to cart',
      description: `${product.title} (${selectedVariant.color}, ${selectedVariant.size})`,
    });
  };

  const uniqueColors = [...new Set(variants.map(v => v.color))];
  const sizesForColor = selectedVariant
    ? variants.filter(v => v.color === selectedVariant.color)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-aesthetic flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-aesthetic flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images
    : ['https://via.placeholder.com/800x1000.png?text=No+Image'];

  return (
    <div className="min-h-screen bg-gradient-aesthetic py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-smooth ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              {selectedVariant && (
                <p className="text-3xl font-bold text-primary">
                  ${selectedVariant.price.toFixed(2)}
                </p>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Color</label>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map(color => {
                    const isSelected = selectedVariant?.color === color;
                    return (
                      <Button
                        key={color}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => {
                          const variant = variants.find(v => v.color === color);
                          if (variant) setSelectedVariant(variant);
                        }}
                        className="relative"
                      >
                        {color}
                        {isSelected && <Check className="ml-2 h-4 w-4" />}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizesForColor.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizesForColor.map(variant => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <Button
                        key={variant.id}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => setSelectedVariant(variant)}
                        className="relative"
                      >
                        {variant.size}
                        {isSelected && <Check className="ml-2 h-4 w-4" />}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Quantity</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariant}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => {
                  handleAddToCart();
                  navigate('/checkout');
                }}
                disabled={!selectedVariant}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
