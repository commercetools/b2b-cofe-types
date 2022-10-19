import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { CartApi } from '../apis/CartApi';
import { QuoteApi } from '../apis/QuoteApi';
import { getLocale } from '../utils/Request';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface QuoteRequestBody {
  comment: string;
}

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
