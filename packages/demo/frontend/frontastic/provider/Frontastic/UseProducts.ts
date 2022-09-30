import { Product } from '@Types/product/Product';
import { Result } from '../../../../types/product/Result';

interface QueryResponse extends Result {
  items: Product[];
}
export interface UseProducts {
  query: (search: string) => Promise<QueryResponse>;
}
