export interface SearchResult {
  products: Array<{
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    description: string | null;
    imageUrl: string | null;
    sku: string;
    category_id: number;
    brand_id: number;
    createdAt: Date;
    updatedAt: Date;
    category: {
      id: number;
      name: string;
    };
    brand: {
      id: number;
      name: string;
    };
    averageRating: number;
    reviewCount: number;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    brand?: string;
    minRating?: number;
    inStock?: boolean;
    sortBy?: string;
    order?: string;
  };
}
