import { LineItem } from '../cart/LineItem';
import { QuoteRequest as CommercetoolsQuoteRequest } from '@commercetools/platform-sdk';
import { StagedQuote } from './StagedQuote';
import { Quote } from './Quote';

export interface QuoteRequest extends Omit<CommercetoolsQuoteRequest, 'lineItems'> {
  readonly lineItems: LineItem[];
  staged?: StagedQuote;
  quoted?: Quote;
}
