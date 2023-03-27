import { Context, Plugin } from '@nuxt/types';
import { IMAGE_TAGS } from '~/helpers/constants';
import path from 'path';

type GetNuxtImageConfig = (context: Context) => { baseURL: string; uploadDir: string };
type GetGlobalImgTag = (context: Context) => IMAGE_TAGS.IMAGE | IMAGE_TAGS.NUXT_IMAGE;

export const getNuxtImageConfig: GetNuxtImageConfig = (context) => {
  const { provider, providers } = context.$img?.options || {};
  const config = providers?.[provider]?.defaults;
  return config || {};
};

/**
 * A helper building a full SAP image url from the path coming from the API
 * and the `mediaHost` provided as part of the app configuration.
 */
export const getSapImageUrl = ({ $config }, imagePath: string) => {
  const { mediaHost } = $config;

  if (!imagePath || !mediaHost) return imagePath;

  return new URL(imagePath, mediaHost).href;

};

/**
 * A helper combining Cloudinary baseURL to relative image paths.
 */
export const getCloudinaryImageUrl = (context: Context, imagePath: string) => {
  const { baseURL: cloudinaryBaseURL } = getNuxtImageConfig(context);

  if (!cloudinaryBaseURL) return imagePath;

  const {
    pathname: cloudinaryImagePath,
    origin: cloudinaryOrigin
  } = new URL(cloudinaryBaseURL);

  const combinedImagePath = path.join(cloudinaryImagePath, imagePath);
  const finalURLObject = new URL(combinedImagePath, cloudinaryOrigin);

  return finalURLObject.href;
};

/**
 * SAP product images' urls contain the `context` searchParam.
 * Unfortunately, Clouidinary strips searchParams off urls. Therefore, if it
 * existis in the provided imageUrl, we append it to the path of the final
 * Cloudinary url. During auto-upload, Cloudinary should hit an external image proxy
 * capable of recognizing that that path and turning it back into a searchParam
 * in order to build a proper SAP product image url.
 *
 * e.g. ?context=1234 =\> context/1234/ =\> ?context=1234
 */
export const getCloudinaryUploadPath = (context: Context, imagePath: string) => {
  const { baseURL, uploadDir } = getNuxtImageConfig(context);

  if (!imagePath || !baseURL || !uploadDir) return imagePath;

  const pathSegments = [uploadDir];

  const [imagePathWithoutParams, searchParams = ''] = imagePath.split('?');

  pathSegments.push(imagePathWithoutParams);

  const sapContextSearchParam = new URLSearchParams(searchParams).get('context');
  if (sapContextSearchParam) pathSegments.push(`context/${sapContextSearchParam}`);

  return path.join(...pathSegments);
};

export const getGlobalImgTag: GetGlobalImgTag = (context) => {
  const { baseURL, uploadDir } = getNuxtImageConfig(context);

  if (!baseURL || !uploadDir) return IMAGE_TAGS.IMAGE;

  return IMAGE_TAGS.NUXT_IMAGE;
};

const imageHelpersPlugin: Plugin = (context, inject) => {
  inject('getSapImageUrl', getSapImageUrl.bind(this, context));
  inject('getCloudinaryImageUrl', getCloudinaryImageUrl.bind(this, context));
  inject('getCloudinaryUploadPath', getCloudinaryUploadPath.bind(this, context));
  inject('globalImgTag', getGlobalImgTag(context));
};

export default imageHelpersPlugin;
