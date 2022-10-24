import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

export const getMyQuoteRequests = async (): Promise<QuoteRequest[]> => {
  return await fetchApiHub('/action/quote/getMyQuotesOverview', { method: 'GET' });
};

export const getMyBusinessUserQuoteRequests = async (): Promise<QuoteRequest[]> => {
  return await fetchApiHub('/action/quote/getMyBusinessUnitQuotesOverview', { method: 'GET' });
};
