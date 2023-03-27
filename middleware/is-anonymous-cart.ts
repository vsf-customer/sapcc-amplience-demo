import { AUTHENTICATED_USER, AUTH_USER_COOKIE_NAME } from '@vsf-enterprise/sapcc-api';
import { COOKIES_NAMES } from '@vsf-enterprise/sapcc';
import { Context } from '@nuxt/types';

/**
 * Redirecting users from the /email route when they are either:
 * 1) logged in (isLoggedIn) or
 * 2) in the process of a guest checkout (isGuestCheckout)
 */
export default async function anonymousCartMiddleware (context: Context) {
  const { $cookies, redirect, localePath, app } = context;
  const { $vsf } = app;
  const redirectRoute = localePath({ name: 'shipping' });

  const isLoggedIn = $cookies.get(AUTH_USER_COOKIE_NAME) === AUTHENTICATED_USER;
  if (isLoggedIn) {
    redirect(redirectRoute);
    return;
  }

  const cartCookieName = `${COOKIES_NAMES.CART_ID}-main`;
  const cartId = $cookies.get(cartCookieName);

  /** TODO: remove userId param after upgrading to sapcc-api v3.x.x */
  const cart = await $vsf.$sapcc.api.getCart({ cartId, userId: 'anonymous' });
  const isGuestCheckout = cart?.user.name === 'guest';

  if (isGuestCheckout) {
    redirect(redirectRoute);
  }
}
