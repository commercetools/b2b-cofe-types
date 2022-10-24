import {
  CustomerReference,
  LineItem as CommercetoolsLineItem,
  QuoteRequest as CommercetoolsQuoteRequest,
  StagedQuote as CommercetoolsStagedQuote,
  Quote as CommercetoolsQuote,
  CartReference,
} from '@commercetools/platform-sdk';
import { Locale } from 'commerce-commercetools/Locale';
import { LineItem } from '../../../types/cart/LineItem';
import { CartMapper } from './CartMapper';
import { QuoteRequest } from '../../../types/quotes/QuoteRequest';
import { Quote } from '../../../types/quotes/Quote';
import { StagedQuote } from '../../../types/quotes/StagedQuote';
import { Cart } from '../../../types/cart/Cart';

export const mapCommercetoolsQuoteRequest = (results: CommercetoolsQuoteRequest[], locale: Locale): QuoteRequest[] => {
  return results?.map((quote) => ({
    ...quote,
    customer: mapCustomerReferences(quote.customer),
    lineItems: mapCommercetoolsLineitems(quote.lineItems, locale),
  }));
};

export const mapCommercetoolsQuote = (results: CommercetoolsQuote[], locale: Locale): Quote[] => {
  return results?.map((quote) => ({
    ...quote,
    customer: mapCustomerReferences(quote.customer),
    lineItems: mapCommercetoolsLineitems(quote.lineItems, locale),
  }));
};

export const mapCommercetoolsStagedQuote = (results: CommercetoolsStagedQuote[], locale: Locale): StagedQuote[] => {
  return results.map((stagedQuote) => ({
    ...stagedQuote,
    quotationCart: mapQuotationCartReference(stagedQuote.quotationCart, locale),
  }));
};

export const mapCustomerReferences = (customer: CustomerReference): CustomerReference => {
  return {
    id: customer.id,
    typeId: 'customer',
    ...customer.obj,
  };
};

export const mapQuotationCartReference = (cartReference: CartReference, locale: Locale): Cart => {
  return CartMapper.commercetoolsCartToCart(cartReference.obj, locale);
};

export const mapCommercetoolsLineitems = (lineitems: CommercetoolsLineItem[], locale: Locale): LineItem[] => {
  return CartMapper.commercetoolsLineItemsToLineItems(lineitems, locale);
};
