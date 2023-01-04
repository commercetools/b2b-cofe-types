import { PaginatedQuery } from './PaginatedQuery';

export interface CategoryQuery extends PaginatedQuery {
  rootCategoryId?: string;
  parentId?: string;
  path?: string;
  slug?: string;
}
