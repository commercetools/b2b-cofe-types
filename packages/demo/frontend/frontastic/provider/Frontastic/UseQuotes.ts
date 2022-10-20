import { QuoteRequestPagedQueryResponse } from '@commercetools/platform-sdk';

export interface UseQuotes {
  getMyQuoteRequests: () => Promise<QuoteRequestPagedQueryResponse>;
  getMyBusinessUserQuoteRequests: () => Promise<QuoteRequestPagedQueryResponse>;
}
