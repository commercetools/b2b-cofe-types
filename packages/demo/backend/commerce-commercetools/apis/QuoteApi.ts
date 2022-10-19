import { QuoteRequest, QuoteRequestDraft } from '@commercetools/platform-sdk';
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
}
