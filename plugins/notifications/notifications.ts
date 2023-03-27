import { AxiosResponse, AxiosError } from 'axios';
import { Context } from '@nuxt/types';
import { COOKIES_NAMES } from '@vsf-enterprise/sapcc';

type CartType = 'wishlist' | 'cart'
interface NotificationCallbacks {
  [key: string]: {
    success?: (response: AxiosResponse, context: Context) => string;
    error?: (error: AxiosError, context: Context) => string;
  }
}

export const NOTIFICATION_CALLBACKS: NotificationCallbacks = {
  createProductReview: {
    success: () => 'Your review has been submitted and will appear upon approval.',
    error: () => 'Failed to add a review.'
  },
  addCartEntry: {
    success: (response, context) => `Product has been added to ${getCartType(response, context)}!`,
    error: (error, context) => `Failed to add product to ${getCartType(error.response, context)}.`
  },
  deleteCartEntry: {
    success: (response, context) => `Product has been removed from ${getCartType(response, context)}.`,
    error: (error, context) => `Failed to remove product from ${getCartType(error.response, context)}.`
  },
  updateCartEntry: {
    success: (response) => response.config.data.includes('quantity')
      ? 'Prouct quantity has been updated!'
      : ''
  },
  changePassword: {
    success: () => 'Your password has been updated!',
    error: (error) => error.response.data.message.includes('PasswordMismatchError')
      ? 'Current password incorrect.'
      : 'Password change failed.'
  },
  updateUser: {
    success: () => 'Your personal data has been updated!'
  },
  addVoucherAndGetNewCartVersion: {
    success: () => 'Coupon has been added!',
    error: (error) => error.response.data.message.includes('coupon.not.active.expired')
      ? 'The coupon has expired.'
      : 'Invalid coupon code.'
  },
  removeVoucherFromCart: {
    success: () => 'Coupon has been removed.'
  },
  createAddress: {
    success: () => 'Your address has been added!'
  },
  updateAddress: {
    success: () => 'Your address has been updated!'
  },
  deleteAddress: {
    success: () => 'Your address has been deleted!'
  },
  OAuthUserRevoke: {
    success: (_response, context) => context.route.query.logout === 'expired'
      ? 'Your session has expired. Please, log in again.'
      : 'You have been logged out.'
  },
  OAuthUserTokenRefresh: {
    error: () => ''
  },
  OAuthUserAuthorization: {
    error: () => 'Invalid login or password.'
  }
};

function getCartType (response: AxiosResponse, context: Context): CartType {
  const cartID = context.$cookies.get(`${COOKIES_NAMES.CART_ID}-wishlist`);
  const { code, guid } = response.data;

  return [code, guid].includes(cartID) ? 'wishlist' : 'cart';
}
