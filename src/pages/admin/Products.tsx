import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Package, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Product, Category, ProductVariant } from '@/types';

export function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    tags: '',
    images: '',
    is_active: true,
  });
  const [variantForm, setVariantForm] = useState({
    color: '',
    size: '',
    price: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error loading products',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchVariants = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('created_at');

      if (error) throw error;
      setVariants(data || []);
    } catch (error: any) {
      console.error('Error fetching variants:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const imageUrls = formData.images
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url);

      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const productData = {
        title: formData.title,
        description: formData.description || null,
        category_id: formData.category_id || null,
        tags: tags.length > 0 ? tags : null,
        images: imageUrls.length > 0 ? imageUrls : null,
        is_active: formData.is_active,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: 'Product updated',
          description: 'Product has been updated successfully.',
        });
      } else {
        const { error } = await supabase.from('products').insert([productData]);

        if (error) throw error;

        toast({
          title: 'Product added',
          description: 'New product has been created successfully.',
        });
      }

      setShowAddModal(false);
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        category_id: '',
        tags: '',
        images: '',
        is_active: true,
      });
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error saving product',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      const { error } = await supabase.from('product_variants').insert([
        {
          product_id: selectedProductId,
          color: variantForm.color,
          size: variantForm.size,
          price: parseFloat(variantForm.price),
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Variant added',
        description: 'Product variant has been added successfully.',
      });

      setVariantForm({ color: '', size: '', price: '' });
      fetchVariants(selectedProductId);
    } catch (error: any) {
      console.error('Error adding variant:', error);
      toast({
        title: 'Error adding variant',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Delete this variant?')) return;

    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;

      toast({
        title: 'Variant deleted',
        description: 'Variant has been removed.',
      });

      if (selectedProductId) {
        fetchVariants(selectedProductId);
      }
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      toast({
        title: 'Error deleting variant',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Product deleted',
        description: 'Product has been removed successfully.',
      });

      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error deleting product',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Product updated',
        description: `Product is now ${!product.is_active ? 'active' : 'inactive'}.`,
      });

      fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error updating product',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      category_id: product.category_id || '',
      tags: product.tags?.join(', ') || '',
      images: product.images?.join(', ') || '',
      is_active: product.is_active,
    });
    setShowAddModal(true);
  };

  const openVariantsModal = (productId: string) => {
    setSelectedProductId(productId);
    fetchVariants(productId);
    setShowVariantsModal(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search products by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search.' : 'Get started by adding your first product.'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-lg bg-gradient-card backdrop-blur-soft border border-border hover:shadow-lg transition-shadow"
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {product.category && (
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {product.category.name}
                  </span>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.is_active
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openVariantsModal(product.id)}
                    className="flex-1"
                  >
                    Variants
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Dress"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., summer, casual, trending"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (comma-separated)</Label>
              <Textarea
                id="images"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Variants Modal */}
      <Dialog open={showVariantsModal} onOpenChange={setShowVariantsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Variants</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddVariant} className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Add New Variant</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  required
                  value={variantForm.color}
                  onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                  placeholder="Red"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  required
                  value={variantForm.size}
                  onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
                  placeholder="M"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={variantForm.price}
                  onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                  placeholder="5000"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </form>

          <div className="space-y-2">
            <h3 className="font-semibold">Existing Variants</h3>
            {variants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No variants yet. Add one above.
              </p>
            ) : (
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {variant.color} - {variant.size}
                      </p>
                      <p className="text-sm text-muted-foreground">₦{variant.price}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteVariant(variant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
