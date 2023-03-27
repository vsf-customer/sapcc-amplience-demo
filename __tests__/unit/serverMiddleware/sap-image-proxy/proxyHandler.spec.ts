import { proxyHandler } from '../../../../serverMiddleware/sap-image-proxy';

describe('[ServerMiddleware][sap-image-proxy] proxyHandler', () => {

  let req: any;
  let res: any;
  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {
        contextValue: 'test'
      }
    };
    res = {
      redirect: jest.fn()
    };
  });

  it('should call res.redirect once', () => {
    const mediaHost = 'http://example.com/';
    process.env.SAPCC_MEDIA_HOST = mediaHost;

    proxyHandler(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
  });

  it('should call res.redirect with the right URL', () => {
    const mediaHost = 'http://example.com/';
    process.env.SAPCC_MEDIA_HOST = mediaHost;

    proxyHandler(req, res);

    const expected = `${mediaHost}medias/?context=test`;
    expect(res.redirect).toHaveBeenCalledWith(expected);
  });
});
