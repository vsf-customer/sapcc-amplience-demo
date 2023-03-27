import { AxiosResponse, AxiosError } from 'axios';
import { Context } from '@nuxt/types';
import { useUiNotification } from '~/composables';
import { NOTIFICATION_CALLBACKS } from './notifications';

export default function notificationsPlugin(context: Context) {
  const { $vsf, i18n } = context.app;
  const { send: sendNotification } = useUiNotification();

  function successCallback (response: AxiosResponse) {
    const message = getSuccessMessage(response, context);
    if (message) sendNotification({ type: 'success', message: i18n.t(message) });

    return response;
  }

  function errorCallback (error: AxiosError) {
    const message = getErrorMessage(error, context);
    if (message) sendNotification({ type: 'danger', message: i18n.t(message) });

    return Promise.reject(error);
  }

  $vsf.$sapcc.client.interceptors.response.use(successCallback, errorCallback);
}

function getSuccessMessage (response: AxiosResponse, context: Context): string {
  const notificationName = response.config.url.replace('/sapcc/', '');
  const callback = NOTIFICATION_CALLBACKS[notificationName]?.success;

  if (callback) return callback(response, context);

  return '';
}

function getErrorMessage (error: AxiosError, context: Context): string {
  const notificationName = error.config.url.replace('/sapcc/', '');
  const callback = NOTIFICATION_CALLBACKS[notificationName]?.error;

  if (callback) return callback(error, context);

  return error.response?.data?.message || '';
}
