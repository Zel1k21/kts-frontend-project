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

  setProductId(id: string) {
    this.productId = id;
  }

  async fetchProduct(id: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await getProduct(id);
      runInAction(() => {
        this.product = Array.isArray(response.data) ? response.data[0] : response.data;
        this.productImages = this.product?.images || [];
        this.currentImageIndex = 0;
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

  async initialize(productId: string) {
    this.productId = productId;
    await Promise.all([this.fetchProduct(this.productId), this.fetchRelatedProducts()]);
  }
}

export const ProductStore = new ProductPageStore();
