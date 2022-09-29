import {
  getAccount,
  changePassword,
  confirm,
  resendVerificationEmail,
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
  update,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
} from '../../actions/account';
import { createSession, adyenCheckout } from '../../actions/adyen';
import {
  cartItems,
  addItem,
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
import { fetch } from '../../actions/channel';
import { query } from '../../actions/product';
import { getWishlist, addToWishlist, removeLineItem, updateLineItem } from '../../actions/wishlist';
import { UseAccount } from './UseAccount';
import { UseAdyen } from './UseAdyen';
import { UseCart } from './UseCart';
import { UseChannel } from './UseChannel';
import { UseProducts } from './UseProducts';
import { UseWishlist } from './UseWishlist';

export interface FrontasticState {
  useCart: UseCart;
  useAccount: UseAccount;
  useWishlist: UseWishlist;
  useAdyen: UseAdyen;
  useChannel: UseChannel;
  useProducts: UseProducts;
}

export const getFrontasticState = (): FrontasticState => {
  return {
    useProducts: {
      query,
    },
    useChannel: {
      fetch,
    },
    useCart: {
      ...cartItems(),
      addItem,
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
    useAccount: {
      ...getAccount(),
      login,
      logout,
      register,
      confirm,
      resendVerificationEmail,
      changePassword,
      requestPasswordReset,
      resetPassword,
      update,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultBillingAddress,
      setDefaultShippingAddress,
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
