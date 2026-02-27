import { getProduct, getRandomProducts } from 'entities/Product/api';
import type { Product, ProductsResponse, Image } from 'entities/Product/types';
import { makeAutoObservable, runInAction } from 'mobx';

class ProductPageStore {
  product: Product | null = null;
  loading = false;
  error: string | null = null;

  productId = '';
  currentImageIndex = 0;

  relatedProducts: Product[] = [];
  productImages: Image[] = [];

  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  setProductImages(images: Image[]) {
    this.productImages = images;
  }

  setCurrentImageIndex(index: number) {
    this.currentImageIndex = index;
  }

  setRelatedProducts(products: Product[]) {
    this.relatedProducts = products;
  }

  setProductId(id: string | undefined) {
    if (id !== undefined) this.productId = id;
  }

  async fetchProduct(id: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await getProduct(id);
      runInAction(() => {
        this.product = Array.isArray(response.data) ? response.data[0] : response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch product' + `: ${error}`;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchRelatedProducts() {
    this.loading = true;
    this.error = null;

    try {
      const response: ProductsResponse = await getRandomProducts(12, this.productId);
      runInAction(() => {
        this.relatedProducts = response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch related products' + `: ${error}`;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async initialize() {
    if (this.isInitialized) return;
    await Promise.all([this.fetchProduct(this.productId), this.fetchRelatedProducts()]);
    this.isInitialized = true;
  }
}

export const ProductStore = new ProductPageStore();
