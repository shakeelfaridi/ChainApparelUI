import axios from 'axios';
import qs from 'qs';

export class OAuth {
  constructor(basePath, OAuthOptions) {
    this.basePath = basePath;
    this.tokenInformation = { ...OAuthOptions };
    this.tokenInformation.grant_type = 'password';
    this.scope = this.tokenInformation.scope;
  }

  setUser(newUsername, newPassword, remember = false) {
    if (newUsername !== this.tokenInformation.username) this.removeToken();
    this.remember = remember;
    this.tokenInformation.username = newUsername;
    this.tokenInformation.password = newPassword;
  }

  getValidRefreshToken() {
    let tokenData = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
    const currentTime = new Date().getTime();
    if (!tokenData) return false;
    tokenData = JSON.parse(tokenData);
    if (!tokenData || typeof tokenData !== 'object' || tokenData.expireTime <= currentTime) return false;
    this.tokenInformation.refresh_token = tokenData.refresh_token;
    this.tokenInformation.username = tokenData.username;
    return true;
  }

  removeToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.tokenInformation.refresh_token = '';
    this.tokenInformation.access_token = '';
  }

  /**
   * Reset the OAUTH token and force a refresh
   */
  resetLogin() {
    this.tokenInformation.access_token = '';
  }

  // changeToSessionToken(){
  //   if(localStorage.getItem('token')){
  //     sessionStorage.setItem('token', localStorage.getItem('token'))
  //     localStorage.removeItem('token');
  //   }
  // }

  /**
   * Get an OAuth Token.
   * @return {promise}
   *   The resolved promise of fetching the oauth token.
   */
  getToken() {
    this.tokenInformation.grant_type = 'password';
    this.tokenInformation.scope = this.scope;

    const currentTime = new Date().getTime();
    // Resolve if token already exists and is fresh
    if (
      this.tokenInformation.access_token &&
      Object.prototype.hasOwnProperty.call(this, 'tokenExpireTime') &&
      this.tokenExpireTime > currentTime
    ) {
      return Promise.resolve();
    }
    // If token is already being fetched, use that one.
    if (this.bearerPromise) {
      return this.bearerPromise;
    }
    // If we have a refresh_token the use that and switch grant_type from password to refresh_token.
    if (this.tokenInformation.refresh_token) {
      this.tokenInformation.grant_type = 'refresh_token';
      delete this.tokenInformation.scope; // scope parameter is not allowed during refresh token
    }
    this.bearerPromise = axios({
      method: 'post',
      url: `${this.basePath}/oauth/token`,
      data: qs.stringify(this.tokenInformation)
    });
    this.bearerPromise
      .then((response) => {
        // console.log("oauth: using tokeninformation: ", JSON.stringify(this.tokenInformation, null, 4));
        delete this.bearerPromise;
        const t = new Date();
        const e = t;
        t.setSeconds(+t.getSeconds() + response.data.expires_in); // access_token expire time
        this.tokenExpireTime = t.getTime();
        Object.assign(this.tokenInformation, response.data);
        e.setSeconds(e.getSeconds() + 1209500); // refresh_token expire time
        this.refreshExpireTime = e.getTime();
        const saveData = JSON.stringify({
          refresh_token: response.data.refresh_token,
          expireTime: this.refreshExpireTime,
          username: this.tokenInformation.username
        });
        if (this.remember) localStorage.setItem('token', saveData);
        else sessionStorage.setItem('token', saveData);
        window.tokenLoaded = true;
        return response.data;
      })
      .catch((e) => {
        // console.log("oauth: using tokeninformation: ", JSON.stringify(this.tokenInformation, null, 4));
        delete this.bearerPromise;
        if (e.message && e.message.indexOf('timeout') !== -1) {
          e.message = 'Timeout';
          e.status = 408;
        } else if (e.message === 'Network Error') {
          e.title = e.message;
          e.status = 404;
        } else if (e.response && e.response.data && e.response.data.errors && e.response.data.errors.length) {
          const err = e.response.data.errors[0];
          e.message = err.detail;
          e.status = err.status;
          e.title = err.title;
        } else if (e.response && e.response.data && e.response.data.error) {
          e.title = e.response.data.error;
          e.message = e.response.data.message;
          e.status = e.response.status;
        } else {
          e.message = e.response ? e.response.data.message : 'Unknown error.';
          e.status = e.response ? e.response.status : 500;
        }

        return Promise.reject(e);
      });

    return this.bearerPromise;
  }
}
