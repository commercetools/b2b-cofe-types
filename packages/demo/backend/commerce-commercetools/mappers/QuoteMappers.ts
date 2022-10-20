import { QuoteRequestPagedQueryResponse } from '@commercetools/platform-sdk';

export const mapCustomerReferences = (
  quoteRequests: QuoteRequestPagedQueryResponse,
): QuoteRequestPagedQueryResponse => {
  return {
    ...quoteRequests,
    results: quoteRequests.results?.map((quote) => ({
      ...quote,
      customer: {
        id: quote.customer.id,
        typeId: 'customer',
        ...quote.customer.obj,
      },
    })),
  };
};
