import { Product } from '@Types/product/Product';
import { Result } from '@Types/product/Result';

export interface ProductQueryResponse extends Result {
  items: Product[];
}
export interface UseProducts {
  query: (search: string) => Promise<ProductQueryResponse>;
}
