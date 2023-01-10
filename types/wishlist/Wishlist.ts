import { Store } from '../store/store';
import { LineItem } from './LineItem';

export interface Wishlist {
  wishlistId: string;
  wishlistVersion?: string;
  anonymousId?: string;
  accountId?: string;
  name?: string;
  description?: string;
  lineItems?: LineItem[];
  store?: Store;
  shared?: string[];
}

export interface WishlistDraft {
  name: string;
  description?: string;
}
