import { getGlobalImgTag } from '../../../../plugins/image-helpers';
import { NuxtImageCloudinaryOptions } from './types';
import { IMAGE_TAGS } from '../../../../helpers/constants';

const baseURL = 'https://res.cloudinary.com/vsf-sap/image/upload/';
const uploadDir = 'sap';

const context = {
  $img: {
    options: {
      provider: 'cloudinary',
      providers: {
        cloudinary: {
          defaults: {} as NuxtImageCloudinaryOptions
        }
      }
    }
  }
} as any;

describe('[Plugins][image-helpers] getGlobalImgTag', () => {
  beforeEach(() => {
    context.$img.options.providers.cloudinary.defaults = { baseURL, uploadDir };
  });

  it('should return `nuxt-img` if full module configuration is defined', () => {
    expect(getGlobalImgTag(context)).toBe(IMAGE_TAGS.NUXT_IMAGE);
  });

  it('should return `img` if baseURL is empty', () => {
    context.$img.options.providers.cloudinary.defaults.baseURL = '';
    expect(getGlobalImgTag(context)).toBe(IMAGE_TAGS.IMAGE);
  });

  it('should return `img` if uploadDir is empty', () => {
    context.$img.options.providers.cloudinary.defaults.uploadDir = '';
    expect(getGlobalImgTag(context)).toBe(IMAGE_TAGS.IMAGE);
  });
});
