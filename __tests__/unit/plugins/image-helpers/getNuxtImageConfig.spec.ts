import { Context } from '@nuxt/types';
import { getNuxtImageConfig } from '../../../../plugins/image-helpers';

// SETUP
const contextReturningEmpty = {
  undefinedModuleConfiguration: {},
  moduleConfigurationEmpty: { $img: {} },
  providerUndefined: {
    $img: {
      options: {
        provider: '',
        providers: {
          cloudinary: {
            defaults: {
              baseURL: 'test-base-url',
              uploadDir: 'test-upload-dir',
              anything: 'test-anything'
            }
          }
        }
      }
    }
  },
  defaultProviderOptionsUndefined: {
    $img: {
      options: {
        provider: 'cloudinary',
        providers: {
          randomProvider: {
            defaults: {
              baseURL: 'test-base-url',
              uploadDir: 'test-upload-dir',
              anything: 'test-anything'
            }
          }
        }
      }
    }
  },
  providersUndefined: {
    $img: {
      options: {
        provider: 'cloudinary',
        providers: {}
      }
    }
  }
};

// TESTS
describe('[Plugins][image-helpers] getNuxtImageConfig', () => {
  const contextMock = { $img: {} } as any;

  let provider: string;
  let options: any;
  beforeEach(() => {
    provider = 'cloudinary';
    options = { provider, providers: {} };
    contextMock.$img.options = options;
  });

  it('should return all provider options when defined', () => {
    options.provider = provider;
    options.providers[provider] = {
      defaults: {
        baseURL: 'test-base-url',
        uploadDir: 'test-upload-dir',
        anything: 'test-anything'
      }
    };

    const returnedOptions = getNuxtImageConfig(contextMock);

    expect(returnedOptions).toBe(options.providers[provider].defaults);
  });

  it.each(Object.values(contextReturningEmpty))(
    'should return empty object when context is %o',
    (context) => {
      const returnedObject = getNuxtImageConfig(context as Context);

      expect(returnedObject).toEqual({});
    }
  );
});
