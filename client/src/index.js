import { runWithAdal } from 'react-adal';
import { authContext } from './adalConfig.js';

const DO_NOT_LOGIN = false;

// Set the original referrer if one is passed.
// Ignore self links and redirects.
// If no referrer is passed the user will be
// prompted to enter the URL manually.
let ref = localStorage.getItem('referrer')
let selfRef = document.referrer.includes(window.location.href)
let loginRedirect = document.referrer.includes("login.microsoftonline.com")
if (!ref && !selfRef && !loginRedirect) {
  localStorage.setItem('referrer', document.referrer);
}

runWithAdal(authContext, () => {
  // eslint-disable-next-line
  require('./indexApp.js');
}, DO_NOT_LOGIN);