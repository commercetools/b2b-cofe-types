import { QuotePagedQueryResponse, QuoteRequest, QuoteRequestDraft, QuoteRequestPagedQueryResponse, StagedQuotePagedQueryResponse } from '@commercetools/platform-sdk';
import { BaseApi } from './BaseApi';

export class QuoteApi extends BaseApi {
  createQuoteRequest: (quoteRequest: QuoteRequestDraft) => Promise<QuoteRequest> = async (quoteRequest: QuoteRequestDraft) => {
    try {
      return this.getApiForProject()
        .quoteRequests()
        .post({
          body: {
            ...quoteRequest
          }
        })
        .execute()
        .then((response) => {
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getQuoteRequests: (customerId: string) => Promise<QuoteRequestPagedQueryResponse> = async (customerId: string) => {
    try {
      return this.getApiForProject()
        .quoteRequests()
        .get({
          queryArgs: {
            where: `customer(id="${customerId}")`,
            expand: 'customer',
            limit: 50,
          }
        })
        .execute()
        .then((response) => {
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getStagedQuotes: (customerId: string) => Promise<StagedQuotePagedQueryResponse> = async (customerId: string) => {
    try {
      return this.getApiForProject()
        .stagedQuotes()
        .get({
          queryArgs: {
            where: `customer(id="${customerId}")`,
            expand: 'customer',
            limit: 50,
          }
        })
        .execute()
        .then((response) => {
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getQuotes: (customerId: string) => Promise<QuotePagedQueryResponse> = async (customerId: string) => {
    try {
      return this.getApiForProject()
        .quotes()
        .get({
          queryArgs: {
            where: `customer(id="${customerId}")`,
            expand: 'customer',
            limit: 50,
          }
        })
        .execute()
        .then((response) => {
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };
}
