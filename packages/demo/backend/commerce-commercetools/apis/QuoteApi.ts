import {
  QuotePagedQueryResponse,
  QuoteRequest,
  QuoteRequestDraft,
  QuoteRequestPagedQueryResponse,
  StagedQuotePagedQueryResponse,
} from '@commercetools/platform-sdk';
import { BaseApi } from './BaseApi';

export class QuoteApi extends BaseApi {
  createQuoteRequest: (quoteRequest: QuoteRequestDraft) => Promise<QuoteRequest> = async (
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

  getQuoteRequestsByCustomer: (customerId: string) => Promise<QuoteRequestPagedQueryResponse> = async (
    customerId: string,
  ) => {
    try {
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
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getStagedQuotesByCustomer: (customerId: string) => Promise<StagedQuotePagedQueryResponse> = async (
    customerId: string,
  ) => {
    try {
      return this.getApiForProject()
        .stagedQuotes()
        .get({
          queryArgs: {
            where: `customer(id="${customerId}")`,
            expand: 'customer',
            limit: 50,
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

  getQuotesByCustomer: (customerId: string) => Promise<QuotePagedQueryResponse> = async (customerId: string) => {
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
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getQuoteRequestsByBusinessUnit: (businessUnitKey: string) => Promise<QuoteRequestPagedQueryResponse> = async (
    businessUnitKey: string,
  ) => {
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
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  getStagedQuotesByBusinessUnit: (businessUnitKey: string) => Promise<StagedQuotePagedQueryResponse> = async (
    businessUnitKey: string,
  ) => {
    try {
      return this.getApiForProject()
        .stagedQuotes()
        .get({
          queryArgs: {
            where: `businessUnit(key="${businessUnitKey}")`,
            expand: 'customer',
            limit: 50,
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

  getQuotesByBusinessUnit: (businessUnitKey: string) => Promise<QuotePagedQueryResponse> = async (
    businessUnitKey: string,
  ) => {
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
