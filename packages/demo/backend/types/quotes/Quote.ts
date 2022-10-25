import { LineItem } from '../cart/LineItem';
import { Quote as CommercetoolsQuote } from '@commercetools/platform-sdk';

export interface Quote extends Omit<CommercetoolsQuote, 'lineItems'> {
  quoteState?: string;
  readonly lineItems: LineItem[];
}
