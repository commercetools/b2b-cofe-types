import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { CartApi } from '../apis/CartApi';
import { QuoteApi } from '../apis/QuoteApi';
import { getLocale } from '../utils/Request';
import { mapCustomerReferences } from '../mappers/QuoteMappers';
import {
  QuotePagedQueryResponse,
  QuoteRequestPagedQueryResponse,
  StagedQuotePagedQueryResponse,
} from '@commercetools/platform-sdk';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface QuoteRequestBody {
  comment: string;
}

const mergeQuotesOverview = (
  quoteRequests: QuoteRequestPagedQueryResponse,
  stagedQuotes: StagedQuotePagedQueryResponse,
  quotes: QuotePagedQueryResponse,
) => {
  // combine quote-requests + quote + staged-quote
  const res = quoteRequests.results?.map((quoteRequest) => {
    const stagedQuote = stagedQuotes.results?.find((stagedQuote) => stagedQuote.quoteRequest.id === quoteRequest.id);
    if (stagedQuote) {
      // @ts-ignore
      quoteRequest.staged = stagedQuote;
      // @ts-ignore
      quoteRequest.quoteRequestState = stagedQuote.stagedQuoteState;
    }
    const quote = quotes.results?.find((quote) => quote.quoteRequest.id === quoteRequest.id);
    if (quote) {
      // @ts-ignore
      quoteRequest.quoted = quote;
      // @ts-ignore
      quoteRequest.quoteRequestState = quote.quoteState;
    }
    return quoteRequest;
  });
  return {
    ...quoteRequests,
    result: res,
  };
};

export const createQuoteRequest: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));

  const quoteBody: QuoteRequestBody = JSON.parse(request.body);
  const cartId = request.sessionData?.cartId;
  if (!cartId) {
    throw new Error('No active cart');
  }

  const cart = await cartApi.getById(cartId);
  const cartVersion = parseInt(cart.cartVersion, 10);
  const quoteRequest = await quoteApi.createQuoteRequest({
    cart: {
      typeId: 'cart',
      id: cartId,
    },
    cartVersion,
    comment: quoteBody.comment,
  });

  await cartApi.deleteCart(cartId, cartVersion);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(quoteRequest),
    sessionData: {
      ...request.sessionData,
      cartId: undefined,
    },
  };

  return response;
};

export const getMyQuoteRequests: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));

  const accountId = request.sessionData?.account?.accountId;
  if (!accountId) {
    throw new Error('No active user');
  }

  const quoteRequests = await quoteApi.getQuoteRequestsByCustomer(accountId);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(mapCustomerReferences(quoteRequests)),
    sessionData: request.sessionData,
  };

  return response;
};

export const getMyQuotesOverview: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));

  const accountId = request.sessionData?.account?.accountId;
  if (!accountId) {
    throw new Error('No active user');
  }

  const quoteRequests = mapCustomerReferences(await quoteApi.getQuoteRequestsByCustomer(accountId));
  const stagedQuotes = await quoteApi.getStagedQuotesByCustomer(accountId);
  const quotes = await quoteApi.getQuotesByCustomer(accountId);

  const res = mergeQuotesOverview(quoteRequests, stagedQuotes, quotes);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(res),
    sessionData: request.sessionData,
  };

  return response;
};

export const getMyBusinessUnitQuotesOverview: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const quoteApi = new QuoteApi(actionContext.frontasticContext, getLocale(request));

  const key = request.sessionData?.organization?.businessUnit?.key;
  if (!key) {
    throw new Error('No active business unit');
  }

  const quoteRequests = mapCustomerReferences(await quoteApi.getQuoteRequestsByBusinessUnit(key));
  const stagedQuotes = await quoteApi.getStagedQuotesByBusinessUnit(key);
  const quotes = await quoteApi.getQuotesByBusinessUnit(key);

  const res = mergeQuotesOverview(quoteRequests, stagedQuotes, quotes);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(res),
    sessionData: request.sessionData,
  };

  return response;
};
