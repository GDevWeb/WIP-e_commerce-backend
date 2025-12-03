import { Review } from "@prisma/client";

export interface ReviewFilters {
  productId?: number;
  customerId?: number;
  minRating?: number;
  maxRating?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginateReviews {
  reviews: Review[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
