import { getProducts, getProductCategories } from 'entities/Product/api';
import type { Product, ProductsResponse, ProductCategory } from 'entities/Product/types';
import { makeAutoObservable, runInAction } from 'mobx';

const PAGE_SIZE = 4;
const DEFAULT_POPULATE = ['productCategory', 'images'];

class ProductStore {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  currentPage = 1;
  totalPages = 0;
  productsCount = 0;

  searchQuery = '';
  selectedCategoryId: string | null = null;

  categories: ProductCategory[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get hasProducts(): boolean {
    return this.products.length > 0;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPrevPage(): boolean {
    return this.currentPage > 1;
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.selectedCategoryId) count++;
    return count;
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  setSelectedCategoryId(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.currentPage = 1;
  }

  async fetchProducts() {
    this.loading = true;
    this.error = null;

    try {
      const filters: Record<string, unknown> = {};

      if (this.selectedCategoryId) {
        filters.productCategory = {
          title: {
            $eq: this.selectedCategoryId,
          },
        };
      }

      if (this.searchQuery) {
        filters.title = { $containsi: this.searchQuery };
      }

      const response: ProductsResponse = await getProducts({
        page: this.currentPage,
        pageSize: PAGE_SIZE,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        populate: DEFAULT_POPULATE,
        sort: 'createdAt:desc',
      });

      runInAction(() => {
        this.products = response.data;
        this.totalPages = response.meta.pagination.pageCount;
        this.productsCount = response.meta.pagination.total;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to fetch products';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchCategories() {
    try {
      const uniqueCategories = await getProductCategories({
        populate: DEFAULT_POPULATE,
      });

      runInAction(() => {
        this.categories = uniqueCategories.sort((a, b) => a.title.localeCompare(b.title));
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to fetch categories';
      });
    }
  }

  async initialize() {
    await Promise.all([this.fetchCategories(), this.fetchProducts()]);
  }
}

export const productStore = new ProductStore();
