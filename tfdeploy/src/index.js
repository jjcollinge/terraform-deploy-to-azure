import { runWithAdal } from 'react-adal';
import { authContext } from './adalConfig.js';

const DO_NOT_LOGIN = true;

runWithAdal(authContext, () => {
  // eslint-disable-next-line
  require('./indexApp.js');
}, DO_NOT_LOGIN);