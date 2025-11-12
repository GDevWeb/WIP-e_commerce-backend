export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
