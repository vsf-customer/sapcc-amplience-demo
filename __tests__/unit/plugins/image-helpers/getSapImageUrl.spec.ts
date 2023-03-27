import { getSapImageUrl } from '../../../../plugins/image-helpers';

const mediaHost = {
  undefined: undefined,
  basic: 'https://api.c1jvi8hu9a-vsfspzooa2-d1-public.model-t.cc.commerce.ondemand.com/'
};

const imagePath = {
  empty: '',
  basic: 'image.png',
  startsWithSlash: '/image.png'
};

/** Make sure the helper always return correct URL without double slashes */
const expectedResult = mediaHost.basic + imagePath.basic;

describe('[Plugins][image-helpers] getSapImageUrl', () => {
  let context: any;
  beforeEach(() => {
    context = { $config: {} };
  });

  const testCases = [
    [mediaHost.undefined, imagePath.startsWithSlash, imagePath.startsWithSlash],
    [mediaHost.basic, imagePath.empty, imagePath.empty],
    [mediaHost.basic, imagePath.basic, expectedResult],
    [mediaHost.basic, imagePath.startsWithSlash, expectedResult]
  ];

  it.each(testCases)(
    'if mediaHost is %p and imagePath is %p should return %p',
    (mediaHost, imagePath, expectedResult) => {
      context.$config = { mediaHost };

      const result = getSapImageUrl(context, imagePath as string);

      expect(result).toBe(expectedResult);
    }
  );
});
