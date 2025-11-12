export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
