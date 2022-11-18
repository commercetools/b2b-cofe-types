import { createSession, adyenCheckout } from '../../actions/adyen';
import {
  cartItems,
  getCart,
  addItem,
  addItems,
  orderCart,
  orderHistory,
  removeItem,
  shippingMethods,
  setShippingMethod,
  updateCart,
  updateItem,
  redeemDiscountCode,
  removeDiscountCode,
  getProjectSettings,
  createQuoteRequestFromCurrentCart,
  splitLineItem,
  replicateCart,
} from '../../actions/cart';
import { query } from '../../actions/product';
import { getMyQuoteRequests, getBusinessUserQuoteRequests, updateQuoteState } from '../../actions/quotes';
import { getStoresByKey } from '../../actions/stores';
import {
  addToWishlist,
  removeLineItem,
  updateLineItem,
  getWishlist,
  getAllWishlists,
  getStoreWishlists,
  addToNewWishlist,
} from '../../actions/wishlist';
import { UseAdyen } from './UseAdyen';
import { UseCart } from './UseCart';
import { UseProducts } from './UseProducts';
import { UseQuotes } from './UseQuotes';
import { UseStores } from './UseStores';
import { UseWishlist } from './UseWishlist';

export interface FrontasticState {
  useCart: UseCart;
  useWishlist: UseWishlist;
  useAdyen: UseAdyen;
  useProducts: UseProducts;
  useQuotes: UseQuotes;
  useStores: UseStores;
}

export const getFrontasticState = (): FrontasticState => {
  return {
    useProducts: {
      query,
    },
    useCart: {
      ...cartItems(),
      getCart,
      addItem,
      addItems,
      updateCart,
      setShippingMethod,
      removeItem,
      updateItem,
      shippingMethods: shippingMethods(),
      orderCart,
      orderHistory,
      getProjectSettings,
      redeemDiscountCode,
      removeDiscountCode,
      createQuoteRequestFromCurrentCart,
      replicateCart,
      splitLineItem,
    },
    useWishlist: {
      getWishlist,
      getAllWishlists,
      getStoreWishlists,
      addToNewWishlist,
      addToWishlist,
      removeLineItem,
      updateLineItem,
    },
    useAdyen: {
      createSession,
      adyenCheckout,
    },
    useQuotes: {
      getMyQuoteRequests,
      getBusinessUserQuoteRequests,
      updateQuoteState,
    },
    useStores: {
      getStoresByKey,
    },
  };
};
