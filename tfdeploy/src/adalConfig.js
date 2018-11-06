import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = {
  clientId: 'c35f7790-574d-4da6-b6d0-be16dca2c51e',
  cacheLocation: 'localStorage',
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, {}, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(authContext, {});