import { QuoteRequest } from '@Types/quotes/QuoteRequest';

export interface UseQuotes {
  getMyQuoteRequests: () => Promise<QuoteRequest[]>;
  getMyBusinessUserQuoteRequests: () => Promise<QuoteRequest[]>;
}
