import { StagedQuote as CommercetoolsQuote } from '@commercetools/platform-sdk';
import { Cart } from '../cart/Cart';

export interface StagedQuote extends Omit<CommercetoolsQuote, 'quotationCart'> {
    quotationCart: Cart;
}
