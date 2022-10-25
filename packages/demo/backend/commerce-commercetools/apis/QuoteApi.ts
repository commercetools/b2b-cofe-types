import { QuoteRequest as CommercetoolsQuoteRequest, QuoteRequestDraft } from '@commercetools/platform-sdk';
import {
  mapCommercetoolsQuote,
  mapCommercetoolsQuoteRequest,
  mapCommercetoolsStagedQuote,
} from '../mappers/QuoteMappers';
import { BaseApi } from './BaseApi';
import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { Quote } from '@Types/quotes/Quote';
import { StagedQuote } from '@Types/quotes/StagedQuote';

export class QuoteApi extends BaseApi {
  createQuoteRequest: (quoteRequest: QuoteRequestDraft) => Promise<CommercetoolsQuoteRequest> = async (
    quoteRequest: QuoteRequestDraft,
  ) => {
    try {
      return this.getApiForProject()
        .quoteRequests()
        .post({
          body: {
            ...quoteRequest,
          },
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

  getQuoteRequestsByCustomer: (customerId: string) => Promise<QuoteRequest[]> = async (customerId: string) => {
    try {
      const locale = await this.getCommercetoolsLocal();

      return this.getApiForProject()
        .quoteRequests()
        .get({
          queryArgs: {
            where: `customer(id="${customerId}")`,
            expand: 'customer',
            limit: 50,
          },
        })
        .execute()
        .then((response) => {
          return mapCommercetoolsQuoteRequest(response.body.results, locale);
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getStagedQuotesByCustomer: (customerId: string) => Promise<StagedQuote[]> = async (customerId: string) => {
    const locale = await this.getCommercetoolsLocal();
    try {
      return this.getApiForProject()
        .stagedQuotes()
        .get({
          queryArgs: {
            where: `customer(id="${customerId}")`,
            expand: ['customer', 'quotationCart'],
            limit: 50,
          },
        })
        .execute()
        .then((response) => {
          return mapCommercetoolsStagedQuote(response.body.results, locale);
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getQuotesByCustomer: (customerId: string) => Promise<Quote[]> = async (customerId: string) => {
    const locale = await this.getCommercetoolsLocal();
    try {
      return this.getApiForProject()
        .quotes()
        .get({
          queryArgs: {
            where: `customer(id="${customerId}")`,
            expand: 'customer',
            limit: 50,
          },
        })
        .execute()
        .then((response) => {
          return mapCommercetoolsQuote(response.body.results, locale);
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getQuoteRequestsByBusinessUnit: (businessUnitKey: string) => Promise<QuoteRequest[]> = async (
    businessUnitKey: string,
  ) => {
    const locale = await this.getCommercetoolsLocal();
    try {
      return this.getApiForProject()
        .quoteRequests()
        .get({
          queryArgs: {
            where: `businessUnit(key="${businessUnitKey}")`,
            expand: 'customer',
            limit: 50,
          },
        })
        .execute()
        .then((response) => {
          return mapCommercetoolsQuoteRequest(response.body.results, locale);
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getStagedQuotesByBusinessUnit: (businessUnitKey: string) => Promise<StagedQuote[]> = async (
    businessUnitKey: string,
  ) => {
    const locale = await this.getCommercetoolsLocal();
    try {
      return this.getApiForProject()
        .stagedQuotes()
        .get({
          queryArgs: {
            where: `businessUnit(key="${businessUnitKey}")`,
            expand: ['customer', 'quotationCart'],
            limit: 50,
          },
        })
        .execute()
        .then((response) => {
          return mapCommercetoolsStagedQuote(response.body.results, locale);
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getQuotesByBusinessUnit: (businessUnitKey: string) => Promise<Quote[]> = async (businessUnitKey: string) => {
    const locale = await this.getCommercetoolsLocal();
    try {
      return this.getApiForProject()
        .quotes()
        .get({
          queryArgs: {
            where: `businessUnit(key="${businessUnitKey}")`,
            expand: 'customer',
            limit: 50,
          },
        })
        .execute()
        .then((response) => {
          return mapCommercetoolsQuote(response.body.results, locale);
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };
}
