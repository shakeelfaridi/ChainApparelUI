import axios from 'axios';
import { Base } from './base';

export class Request extends Base {
  /**
   * Create an instance of the Request class.
   * @param {object} options
   *   The configuration used to create a new instance of Waterwheel.
   * @param {string} options.base
   *   The base URL.
   * @param {object} oauth
   *   The OAuth options.
   */
  constructor(options, oauth) {
    super(options);
    this.oauth = oauth;
  }

  /**
   * Issue a generic XMLHttpRequest.
   * @param {string} method
   *  The HTTP method to be used in the request.
   * @param {string} url
   *  The URL against which to issue the request.
   * @param {string} XCSRFToken
   *  An X-CSRF-Token from Drupals REST API.
   * @param {object} additionalHeaders
   *  An object containing additional request header key-value pairs.
   * @param {object} body
   *  An object containing the request body to be sent.
   * @param {string} baseOverride
   *   Override the base URL in special scenarios.
   * @returns {Promise}
   *  A Promise that when fulfilled returns a response from the request.
   */
  issueRequest(method, url, XCSRFToken, additionalHeaders, body, baseOverride) {
    return (this.options.accessCheck && this.options.validation ? this.oauth.getToken() : Promise.resolve()).then(() => {
      const options = {
        method,
        timeout: this.options.timeout,
        url: `${baseOverride || this.options.base}/${url.charAt(0) === '/' ? url.slice(1) : url}`,
        headers: {
          // 'Content-Type': 'application/json',
          'X-CSRF-Token': XCSRFToken
        }
      };

      if (this.options.accessCheck && this.options.validation) {
        if (this.oauth.authType === 'cookie') {
          // options.headers.Cookie = this.oauth.tokenInformation.refresh_token;
          options.withCredentials = true;
        } else {
          options.headers.Authorization = `Bearer ${this.oauth.tokenInformation.access_token}`;
        }
      }

      // If this is a GET request,
      // or we didn't pass a token drop the X-CSRF-Token header.
      if (method === 'get' || !XCSRFToken) {
        delete options.headers['X-CSRF-Token'];
      }

      // If we have additionalHeaders, set them.
      if (additionalHeaders && Object.keys(additionalHeaders).length !== 0) {
        Object.keys(additionalHeaders).forEach((key) => {
          options.headers[key] = additionalHeaders[key];
        });
      }

      if (body) {
        options.data = body;
      }

      return axios(options)
        .then((res) => Promise.resolve(res.data))
        .catch((err) => {
          if (err.message && err.message.indexOf('timeout') !== -1) {
            err.message = 'Timeout';
            err.status = 408;
          } else if (err.response && err.response.data && err.response.data.errors && err.response.data.errors.length) {
            // DZ: Better error handling 03/12/2018
            const e = err.response.data.errors[0];
            err.message = e.detail;
            err.status = e.status;
            err.title = e.title;
          } else {
            err.message = err.response ? err.response.data.message : 'Unknown error.';
            err.status = err.response ? err.response.status : 500;
          }

          return Promise.reject(err);
        });
    });
  }

  /**
   * This function performs a request with the current oauth creds
   * to the `/userinfo` endpoint. the reasoning behind this is
   * a 401 unauthorized can be a rights issue and not login revocation.
   * so we test this endpoint since it is considered public if you have
   * valid oauth creds. so we can isolate
   */
  async checkAuthorizationValidity() {
    try {
      await this.issueRequest('get', '/oauth/userinfo');
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get an X-CSRF-Token from Drupal's REST module.
   * @return {Promise}
   *  A Promise that when fulfilled returns a response containing the X-CSRF-Token.
   */
  getXCSRFToken() {
    if (this.csrfToken) {
      return Promise.resolve(this.csrfToken);
    }
    return new Promise((resolve, reject) => {
      axios({ method: 'get', url: `${this.options.base}/rest/session/token` })
        .then((res) => {
          this.csrfToken = res.data;
          return resolve(res.data);
        })
        .catch((err) => reject(err));
    });
  }
}
