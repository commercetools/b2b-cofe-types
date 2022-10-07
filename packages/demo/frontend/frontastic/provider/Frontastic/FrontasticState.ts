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
  updateName,
  addAddress as addBusinessUnitAdddress,
  getMyBusinessUnit,
  createBusinessUnitAndStore,
  getMyOrganization,
} from '../../actions/business-unit';
import {
  cartItems,
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
import { UseAccount } from './UseAccount';
import { UseAdyen } from './UseAdyen';
import { UseBusinessUnit } from './UseBusinessUnit';
import { UseCart } from './UseCart';
import { UseProducts } from './UseProducts';
import { UseWishlist } from './UseWishlist';

export interface FrontasticState {
  useCart: UseCart;
  useAccount: UseAccount;
  useWishlist: UseWishlist;
  useAdyen: UseAdyen;
  useProducts: UseProducts;
  useBusinessUnit: UseBusinessUnit;
}

export const getFrontasticState = (): FrontasticState => {
  return {
    useBusinessUnit: {
      businessUnit: getMyBusinessUnit(),
      getMyOrganization,
      updateName,
      addAddress: addBusinessUnitAdddress,
      createBusinessUnitAndStore,
    },
    useProducts: {
      query,
    },
    useCart: {
      ...cartItems(),
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
