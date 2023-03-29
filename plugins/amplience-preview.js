import { AMPLIENCE_PREVIEW_COOKIE } from '~/helpers/constants';

export default function ({ query, app }) {
  if (query.ampl_domain) app.$cookies.set(AMPLIENCE_PREVIEW_COOKIE, query);
}
