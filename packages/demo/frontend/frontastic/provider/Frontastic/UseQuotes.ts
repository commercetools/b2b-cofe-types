import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { Quote, QuoteState } from '@commercetools/platform-sdk';

export interface UseQuotes {
  getMyQuoteRequests: () => Promise<QuoteRequest[]>;
  getMyBusinessUserQuoteRequests: () => Promise<QuoteRequest[]>;
  updateQuoteState: (id: string, state: QuoteState) => Promise<Quote>;
}
