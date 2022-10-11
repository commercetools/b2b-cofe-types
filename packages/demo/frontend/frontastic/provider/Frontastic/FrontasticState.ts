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
} from '../../actions/cart';
import { query } from '../../actions/product';
import { getWishlist, addToWishlist, removeLineItem, updateLineItem } from '../../actions/wishlist';
import { UseAdyen } from './UseAdyen';
import { UseCart } from './UseCart';
import { UseProducts } from './UseProducts';
import { UseWishlist } from './UseWishlist';

export interface FrontasticState {
  useCart: UseCart;
  useWishlist: UseWishlist;
  useAdyen: UseAdyen;
  useProducts: UseProducts;
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
    },
    useWishlist: {
      ...getWishlist(),
      addToWishlist,
      removeLineItem,
      updateLineItem,
    },
    useAdyen: {
      createSession,
      adyenCheckout,
    },
  };
};
