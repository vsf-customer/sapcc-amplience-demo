<div align="center">
<img src="https://user-images.githubusercontent.com/1626923/137092657-fb398d20-b592-4661-a1f9-4135db0b61d5.png" height="80px"/>
</div>
# Vue Storefront 2 integration with SAP Commerce Cloud

> The Vue Storefront 2 integration for SAP Commerce Cloud is only available as part of our [Vue Storefront Enterprise](https://docs.vuestorefront.io/v2/general/enterprise.html) offering and is maintained by the product team. To learn more about the enterprise offering, [contact our Sales team](https://vuestorefront.io/contact/sales)

Repository is a starter Vue Storefront 2 application integrated with SAP Commerce Cloud.

### Requirements:
- NodeJS >=14 <=16
- Yarn
- [SAP Commerce Cloud](https://www.sap.com/products/crm/commerce-cloud.html)

### Where to start?

To get started, see the following guides:

- [Introduction](https://docs.vuestorefront.io/v2/getting-started/introduction.html) to learn what is Vue Storefront

- [Configuration](https://docs.vuestorefront.io/sapcc/essentials/configuration.html) to install and setup new Vue Storefront project for SAP Commerce Cloud

### Local dev setup
```bash
# install dependencies
$ yarn install
# serve with hot reload at localhost:3000
$ yarn dev
```

### Multistore local dev setup
1. Install [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) on your local machine.

2. Add your hosts to the `/etc/hosts` file:
    ```
    127.0.0.1       myshop1.local myshop2.local
    ```

3. Set `API_BASE_URL=/api/` env variable in the `.env` file.

4. If you're using Linux: uncomment lines 10 and 11 in the `docker-compose.yml` file.

5. Add your hosts to the `server_name` option inside the `docker/nginx/nginx.conf` file:
    ```
    server_name localhost myshop1.local myshop2.local;
    ```

6. Because this is a local dev setup and nginx is configured to use an unsecured HTTP connection, you need to disable the secure cookie option in the `middleware.config.js` (WARNING: you should NOT disable this config on production environment due to security concerns):
    ```js
    const { AUTH_USER_TOKEN_COOKIE_NAME } = require('@vsf-enterprise/sapcc');
    
    module.exports = {
      integrations: {
        sapcc: {
          configuration: {
            OAuth: {
              cookie_options: {
                [AUTH_USER_TOKEN_COOKIE_NAME]: {
                  secure: false
                }
              }
            }
          }
        }
      }
    };
    ```

7. Start docker-compose daemon:
    ```bash
    $ docker-compose up -d
    ```

8. Start storefront dev server:
    ```bash
    $ yarn dev
    ```

## Resources

- [Vue Storefront Documentation](https://docs.vuestorefront.io/v2/)
- [Vue Storefront Enterprise Documentation](https://docs.vuestorefront.io/v2/general/enterprise.html)
- [SAP Commerce Cloud Integration Documentation](https://docs.vuestorefront.io/sapcc/)
- [API References](https://docs.vuestorefront.io/sapcc/reference/api/)
- [Community Chat](http://discord.vuestorefront.io) 

## Support

If you have any questions about this integration we will be happy to answer them on `general-help` channel on [our Discord](http://discord.vuestorefront.io).

