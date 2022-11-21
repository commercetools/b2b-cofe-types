import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { ProductQueryResponse } from 'frontastic/provider/Frontastic/UseProducts';

export const query = async (search: string): Promise<ProductQueryResponse> => {
  return await fetchApiHub(`/action/product/query?${search}`, { method: 'GET' });
};
export const getAttributeGroup = async (key: string): Promise<string[]> => {
  return await fetchApiHub(`/action/product/getAttributeGroup?key=${key}`, { method: 'GET' });
};
