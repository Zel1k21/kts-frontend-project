import { api } from 'shared/api';
import type { ProductsResponse, ProductResponse } from './types';
import qs from 'qs';
import { getRandomItems } from 'shared/getRandomItems';

const DEFAULT_POPULATE = ['images', 'productCategory'];

export const getRandomProducts = async (
  limit: number = 12,
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
