import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = {
  clientId: '7e3f58e3-aeef-4738-b7bf-cc476e66a527',
  cacheLocation: 'localStorage',
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, {}, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(authContext, {});