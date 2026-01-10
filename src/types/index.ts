export interface Admin {
  id: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  tags: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
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

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_paid: number;
  payment_method: 'paystack' | 'mobile_money';
  paystack_reference: string | null;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  category?: Category;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product: Product;
    variant: ProductVariant;
  })[];
}
