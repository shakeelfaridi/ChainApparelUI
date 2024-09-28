import qs from 'qs';

const methods = {
  get: 'get',
  patch: 'patch',
  post: 'post',
  delete: 'delete'
};

export class JSONAPI {
  constructor(options, request) {
    this.request = request;
    this.jsonapiPrefix = (options && options.jsonapiPrefix) || 'jsonapi';
  }

  /**
   * GET jsonapi
   *
   * @param {string} resource
   *   The relative path to fetch from the API.
   * @param {object} params
   *   GET arguments to send with the request.
   * @param {string} id
   *   An ID of an individual item to request.
   * @return {promise}
   *   Resolves when the request is fulfilled, rejects if there's an error.
   */
  get(resource, params, id = false) {
    const query = typeof params === 'object' && Object.keys(params).length ? qs.stringify(params, { indices: false }) : params;
    const url = `/${this.jsonapiPrefix}/${resource}${id ? `/${id}` : ''}?${query}`;

    const requestPromise = this.request.issueRequest(methods.get, url);

    return this.catchUnauthorizedReqeust(requestPromise);
  }

  /**
   * POST jsonapi
   *
   * @param {string} resource
   *   The relative path to fetch from the API.
   * @param  {object} body
   *   JSON data sent to Drupal
   * @param header
   * @return {promise}
   *   Resolves when the request is fulfilled, rejects if there's an error.
   */
  post(resource, body, header) {
    const requestPromise = this.request.issueRequest(
      methods.post,
      `/${this.jsonapiPrefix}/${resource}`,
      '',
      header || { 'Content-Type': 'application/vnd.api+json' },
      body
    );

    return this.catchUnauthorizedReqeust(requestPromise);
  }

  /**
   * PATCH jsonapi
   *
   * @param {string} resource
   *   The relative path to fetch from the API.
   * @param  {object} body
   *   JSON data sent to Drupal
   * @return {promise}
   *   Resolves when the request is fulfilled, rejects if there's an error.
   */
  patch(resource, body) {
    const requestPromise = this.request.issueRequest(
      methods.patch,
      `/${this.jsonapiPrefix}/${resource}`,
      '',
      {
        'Content-Type': 'application/vnd.api+json'
      },
      body
    );

    return this.catchUnauthorizedReqeust(requestPromise);
  }

  /**
   * DELETE jsonapi
   *
   * @param {string} resource
   *   The relative path to fetch from the API.
   * @param {string} id
   *   An ID of an individual item to delete.
   * @return {promise}
   *   Resolves when the request is fulfilled, rejects if there's an error.
   */
  delete(resource, id) {
    const url = `/${this.jsonapiPrefix}/${resource}/${id}`;

    const requestPromise = this.request.issueRequest(methods.delete, url, '', {
      'Content-Type': 'application/vnd.api+json'
    });

    return this.catchUnauthorizedReqeust(requestPromise);
  }

  /**
   * Catch when a request has lost its auth status
   * @param requestPromise
   */
  catchUnauthorizedReqeust(requestPromise) {
    return new Promise((resolve, reject) => {
      requestPromise
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => {
          if (err.status && err.status === 401) {
            this.request.checkAuthorizationValidity().then((isValid) => {
              if (isValid) {
                reject(err);
              } else {
                console.log('emitted invalid oauth event');
                const oauthInvalidEvent = new Event('oauth_invalid');
                window.dispatchEvent(oauthInvalidEvent);
              }
            });
          } else {
            reject();
          }
        });
    });
  }
}