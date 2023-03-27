import { getCloudinaryImageUrl } from '../../../../plugins/image-helpers';

const baseURL = {
  undefined: undefined,
  basic: 'https://res.cloudinary.com/vsf-sap/image/upload'
};

const imagePath = {
  basic: 'image.png',
  endsWithSlash: 'image.png/',
  startsWithSlash: '/image.png',
  startsEndsWithSlash: '/image.png/',
  nested: '/directory/image.png'
};

const expectedResults = {
  simplePath: 'https://res.cloudinary.com/vsf-sap/image/upload/image.png',
  nestedPath: 'https://res.cloudinary.com/vsf-sap/image/upload/directory/image.png'
};

describe('[Plugins][image-helpers] getCloudinaryImageUrl', () => {
  let context: any;
  beforeEach(() => {
    context = {
      $img: {
        options: {
          provider: 'cloudinary',
          providers: {
            cloudinary: {
              defaults: {}
            }
          }
        }
      }
    };
  });

  const testCases = [
    [baseURL.undefined, imagePath.startsWithSlash, imagePath.startsWithSlash],
    [baseURL.basic, imagePath.basic, expectedResults.simplePath],
    [baseURL.basic, imagePath.startsWithSlash, expectedResults.simplePath],
    [baseURL.basic, imagePath.nested, expectedResults.nestedPath]
  ];

  it.each(testCases)(
    'if baseUrl is %p and imagePath is %p should return %p',
    (baseURL, imagePath, expectedResult) => {
      context.$img.options.providers.cloudinary.defaults = { baseURL };

      const result = getCloudinaryImageUrl(context, imagePath as string);

      expect(result).toBe(expectedResult);
    }
  );
});
