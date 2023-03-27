import { buildFinalUrl } from '../../../../serverMiddleware/sap-image-proxy';

describe('[ServerMiddleware][sap-image-proxy] buildFinalUrl', () => {
  it('should build url from media host and context param', () => {
    const mediaHost = 'http://example.com/';
    const contextParam = '1234';

    const url = buildFinalUrl(mediaHost, contextParam);

    const expected = `${mediaHost}medias/?context=${contextParam}`;
    expect(url).toBe(expected);
  });
});
