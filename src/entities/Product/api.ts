import qs from 'qs';
import { api } from 'shared/api';
import { getRandomItems } from 'shared/getRandomItems';

import type { ProductsResponse, ProductResponse, ProductCategory } from './types';

const DEFAULT_POPULATE = ['images', 'productCategory'];

// Для "похожих" товаров
export const getRandomProducts = async (
  limit = 12,
  currentProduct?: string
): Promise<ProductsResponse> => {
  const query = qs.stringify({
    populate: DEFAULT_POPULATE,
    pagination: {
      pageSize: limit + 3,
    },
    sort: 'id:asc',
  });

  const response = await api.get<ProductsResponse>(`/products?${query}`);
  let data = response.data.data;
  if (currentProduct) {
    data = data.filter((p) => p.documentId !== currentProduct);
  }
  const randomItems = getRandomItems(data, limit);
  return {
    ...response.data,
    data: randomItems,
  };
};

// Для всех товаров
export const getProducts = async (
  params: {
    page?: number;
    pageSize?: number;
    populate?: string[];
    filters?: Record<string, unknown>;
    sort?: string | string[];
  } = {}
): Promise<ProductsResponse> => {
  const { page = 1, pageSize = 12, populate = DEFAULT_POPULATE, filters, sort } = params;

  const query = qs.stringify(
    {
      populate,
      pagination: {
        page,
        pageSize,
      },
      filters,
      sort,
    },
    {
      encode: false,
      arrayFormat: 'brackets',
      skipNulls: true,
    }
  );

  const response = await api.get<ProductsResponse>(`/products?${query}`);
  return response.data;
};

// Для категорий
export const getProductCategories = async (
  params: {
    populate?: string[];
  } = {}
): Promise<ProductCategory[]> => {
  const { populate = DEFAULT_POPULATE } = params;

  const query = qs.stringify(
    {
      populate,
    },
    {
      encode: false,
      arrayFormat: 'brackets',
      skipNulls: true,
    }
  );

  const response = await api.get<ProductsResponse>(`/products?${query}`);

  const uniqueCategories = response.data.data.reduce((acc: ProductCategory[], product) => {
    const category = product.productCategory;
    if (category && !acc.find((c) => c.title === category.title)) {
      acc.push(category);
    }
    return acc;
  }, []);
  uniqueCategories.sort((a, b) => a.title.localeCompare(b.title));
  return uniqueCategories;
};

//Для страницы одного товара
export const getProduct = async (
  documentId: string,
  populate: string[] = DEFAULT_POPULATE
): Promise<ProductResponse> => {
  const query = qs.stringify({
    populate,
    filters: {
      documentId: { $eq: documentId },
    },
  });

  const response = await api.get<ProductResponse>(`/products?${query}`);
  return response.data;
};
