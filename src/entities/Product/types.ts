export type ImageFormat = {
  url: string;
  width: number;
  height: number;
  [key: string]: unknown;
};

export type Image = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type ProductCategory = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  image?: Image;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Product = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  rating: number;
  isInStock: boolean;
  images?: Image[];
  productCategory?: ProductCategory;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type ApiMeta = {
  pagination: Pagination;
};

export type ProductsResponse = {
  data: Product[];
  meta: ApiMeta;
};

export type ProductResponse = {
  data: Product;
  meta?: Record<string, unknown>;
};

export type ProductsPageResponse = {
  products: Product[];
  categories: ProductCategory[];
  pagination: Pagination;
};
