import { QuoteRequest } from '../../../../types/quotes/QuoteRequest';

export interface UseQuotes {
  getMyQuoteRequests: () => Promise<QuoteRequest[]>;
  getMyBusinessUserQuoteRequests: () => Promise<QuoteRequest[]>;
}
