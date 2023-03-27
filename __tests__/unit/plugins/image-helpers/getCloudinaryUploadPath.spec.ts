import { getCloudinaryUploadPath } from '../../../../plugins/image-helpers';

const baseURL = {
  undefined: undefined,
  basic: 'https://res.cloudinary.com/vsf-sap/image/upload'
};

const uploadDir = {
  undefined: undefined,
  basic: 'sap'
};

const imagePath = {
  undefined: undefined,
  null: null,
  emptyString: '',
  basic: '/example',
  withContext: {
    alone: '/example?context=1234',
    withParamBefore: '/example?paramBefore=something&context=1234',
    withParamAfter: '/example?context=1234&paramAfter=something',
    withParamBeforeAndAfter: '/example?paramBefore=something&context=1234&paramAfter=something'
  }
};

describe('[Plugins][image-helpers] getCloudinaryUploadPath', () => {
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
    [baseURL.undefined, uploadDir.undefined, imagePath.basic, imagePath.basic],
    [baseURL.basic, uploadDir.undefined, imagePath.basic, imagePath.basic],
    [baseURL.undefined, uploadDir.basic, imagePath.basic, imagePath.basic],
    [baseURL.basic, uploadDir.basic, imagePath.basic, 'sap/example'],
    [baseURL.basic, uploadDir.basic, imagePath.basic, 'sap/example'],
    [baseURL.basic, uploadDir.basic, imagePath.withContext.alone, 'sap/example/context/1234'],
    [baseURL.basic, uploadDir.basic, imagePath.withContext.withParamBefore, 'sap/example/context/1234'],
    [baseURL.basic, uploadDir.basic, imagePath.withContext.withParamBeforeAndAfter, 'sap/example/context/1234'],
    [baseURL.basic, uploadDir.basic, imagePath.withContext.withParamAfter, 'sap/example/context/1234'],
    [baseURL.basic, uploadDir.basic, imagePath.undefined, undefined],
    [baseURL.basic, uploadDir.basic, imagePath.null, null],
    [baseURL.basic, uploadDir.basic, imagePath.emptyString, '']
  ];

  it.each(testCases)(
    'if baseUrl is %p, uploadDir is %p and imagePath is %p should return %p',
    (baseURL, uploadDir, imagePath, expectedResult) => {
      context.$img.options.providers.cloudinary.defaults = { baseURL, uploadDir };

      const result = getCloudinaryUploadPath(context, imagePath as string);

      expect(result).toBe(expectedResult);
    }
  );
});
