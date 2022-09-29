import { Result } from '../../../../types/product/Result';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

export const query = async (search: string): Promise<Result> => {
  return await fetchApiHub(`/action/product/query?${search}`, { method: 'GET' });
};
