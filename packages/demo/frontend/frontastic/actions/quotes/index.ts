import { QuoteRequestPagedQueryResponse } from '@commercetools/platform-sdk';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

export const getMyQuoteRequests = async (): Promise<QuoteRequestPagedQueryResponse> => {
  return await fetchApiHub('/action/quote/getMyQuotesOverview', { method: 'GET' });
};

export const getMyBusinessUserQuoteRequests = async (): Promise<QuoteRequestPagedQueryResponse> => {
  return await fetchApiHub('/action/quote/getMyBusinessUnitQuotesOverview', { method: 'GET' });
};
