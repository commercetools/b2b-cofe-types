import { Product } from './Product';
import { Category } from './Category';
export interface Result {
    total?: number;
    previousCursor?: string;
    nextCursor?: string;
    count: number;
    items: Product[] | Category[];
    facets?: any[];
    query?: any;
}
