import { Result } from '../../../../types/product/Result';
export interface UseProducts {
  query: (search: string) => Promise<Result>;
}
