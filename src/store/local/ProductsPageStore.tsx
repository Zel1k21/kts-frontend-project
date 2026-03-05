import { getProducts, getProductCategories } from 'entities/Product/api';
import type { Product, ProductsResponse, ProductCategory } from 'entities/Product/types';
import { makeAutoObservable, runInAction } from 'mobx';

const PAGE_SIZE = 4;
const DEFAULT_POPULATE = ['productCategory', 'images'];

export type ProductQueryParams = {
  page?: number;
  search?: string;
  category?: string | null;
  sort?: string;
};

export class ProductsPageStore {
  productsList: Product[] = [];
  loading = false;
  error: string | null = null;

  currentPage = 1;
  totalPages = 0;
  pageSize = PAGE_SIZE;
  productsCount = 0;

  searchQuery = '';
  selectedCategoryTitle: string | null = null;

  categories: ProductCategory[] = [];
  isInitialized = false;

  sortBy = 'createdAt:desc';
  pageWasReset = false; // Фильтр для обработки пустой страницы

  constructor() {
    makeAutoObservable(this);
  }

  // Computed-поля

  // Есть ли товары
  get hasProducts(): boolean {
    return this.productsList.length > 0;
  }

  // Количество активных фильтров
  get activeFiltersCount(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.selectedCategoryTitle) count++;
    return count;
  }

  // Action-поля

  // Обработчик изменения поискового запроса
  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  // Обработчик изменения выбранной категории
  setSelectedCategoryTitle(categoryId: string | null) {
    this.selectedCategoryTitle = categoryId;
  }

  // Обработчик изменения текущей страницы
  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  // Обработчик применения параметров из URL
  applyUrlParams(params: ProductQueryParams) {
    runInAction(() => {
      if (params.page != null && params.page > 0 && params.page !== this.currentPage) {
        this.currentPage = params.page;
      }
      if (params.search != null && params.search !== this.searchQuery) {
        this.searchQuery = params.search;
      }
      if (params.category != null && params.category !== this.selectedCategoryTitle) {
        this.selectedCategoryTitle = params.category;
      }
      if (params.sort != null && params.sort !== this.sortBy) {
        this.sortBy = params.sort;
      }
    });
  }

  // Установка параметров для передачи в запрос
  getUrlParams(): ProductQueryParams {
    const params: ProductQueryParams = {};
    if (this.currentPage) params.page = this.currentPage;
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategoryTitle) params.category = this.selectedCategoryTitle;
    if (this.sortBy !== 'createdAt:desc') params.sort = this.sortBy;
    return params;
  }

  // загрузка данных
  async fetchProducts() {
    const requestedPage = this.currentPage;
    this.loading = true;
    this.error = null;

    try {
      const filters: Record<string, unknown> = {};

      if (this.selectedCategoryTitle) {
        filters.productCategory = {
          title: {
            $eq: this.selectedCategoryTitle,
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
        sort: this.sortBy,
      });

      runInAction(() => {
        this.productsList = response.data;
        this.totalPages = response.meta.pagination.pageCount;
        this.productsCount = response.meta.pagination.total;

        // Проверка, если страница пуста
        if (requestedPage > 1 && response.data.length === 0) {
          this.currentPage = 1;
          this.pageWasReset = true;
        } else {
          this.pageWasReset = false;
        }
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

  // Загрузка категорий
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
    if (this.isInitialized) return;
    await Promise.all([this.fetchCategories(), this.fetchProducts()]);
    this.isInitialized = true;
  }

  dispose() {
    this.productsList = [];
    this.loading = false;
    this.error = null;
    this.currentPage = 1;
    this.totalPages = 0;
    this.productsCount = 0;
    this.searchQuery = '';
    this.selectedCategoryTitle = null;
    this.categories = [];
    this.isInitialized = false;
    this.sortBy = 'createdAt:desc';
    this.pageWasReset = false;
  }
}

export const createProductsPageStore = () => {
  return new ProductsPageStore();
};

export const ProductsStore = new ProductsPageStore();
