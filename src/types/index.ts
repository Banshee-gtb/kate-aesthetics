export interface Product {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  tags: string[] | null;
  images: string[] | null;
  is_active: boolean;
  shipping_fee: number;
  created_at: string;
  category?: Category;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  size: string;
  price: number;
  in_stock: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_paid: number;
  payment_method: string;
  paystack_reference: string | null;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}
