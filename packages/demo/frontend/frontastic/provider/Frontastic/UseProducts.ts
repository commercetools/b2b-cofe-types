import { Product } from '@Types/product/Product';
import { Result } from '../../../../types/product/Result';

export interface ProductQueryResponse extends Result {
  items: Product[];
}
export interface UseProducts {
  query: (search: string) => Promise<ProductQueryResponse>;
}
