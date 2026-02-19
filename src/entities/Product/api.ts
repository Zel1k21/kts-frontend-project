import { api } from 'shared/api';
import type { ProductsResponse } from './types';
import qs from 'qs';

const DEFAULT_POPULATE = ['images', 'productCategory'];

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
      encode: false, // чтобы скобки не кодировались в %5B%5D
      arrayFormat: 'brackets',
      skipNulls: true,
    }
  );

  const response = await api.get<ProductsResponse>(`/products?${query}`);
  return response.data;
};
