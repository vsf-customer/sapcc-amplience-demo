import { Context } from '@nuxt/types';
import { COOKIES_NAMES, CURRENT_USER_ID } from '@vsf-enterprise/sapcc';

export default function isAuthenticatedMiddleware(context: Context) {
  const { app, redirect } = context;
  const { localePath, $cookies } = app;

  const isAuthenticated = $cookies.get(COOKIES_NAMES.USER) === CURRENT_USER_ID;

  if (!isAuthenticated) {
    redirect(localePath({ name: 'home' }));
  }
}
