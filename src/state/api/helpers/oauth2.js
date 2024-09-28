import authorizationApi from '../authorizationApi';

const LOCALSTORAGE_KEY_OAUTH_TOKEN = 'oauth_token';

export class OAuth2 {
  authorizationCode;

  authorizationDomain;

  tokenEndpoint;

  authorizeEndpoint;

  tokenInformation;

  clientId;

  clientSecret;

  redirectUrl;

  constructor({ redirectUrl, clientId, clientSecret, authorizeEndpoint, tokenEndpoint, authorizationDomain }) {
    this.authorizationCode = null;
    this.authorizeEndpoint = authorizeEndpoint;
    this.tokenEndpoint = tokenEndpoint;
    this.tokenInformation = {};
    this.clientSecret = clientSecret;
    this.clientId = clientId;
    this.redirectUrl = redirectUrl;
    this.authorizationDomain = authorizationDomain;
  }

  async initializeOauthSession() {
    /**
     * Get the token from the localstorage/session
     */
    const hasPersistedToken = this.getTokenFromPersistentStorage();

    /**
     * Check if authorization values
     * are present
     *
     * (E.G we are being directed back from the auth portal)
     */
    const hasAuthorizeValues = this.getAuthorizeValuesFromQuery();

    if (hasPersistedToken) {
      return true;
    }
    /**
     * Getting authorization credentials
     * from the auth portal takes precedence over all other forms
     * of authentication
     */
    if (hasAuthorizeValues) {
      const tokenRequest = authorizationApi.post(
        this.tokenEndpoint,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: this.authorizationCode,
          redirect_uri: this.redirectUrl,
          client_id: this.clientId,
          client_secret: this.clientSecret
        })
      );

      const response = await tokenRequest.catch((err) => {
        console.log('Token request has failed, response: ', err);
      });

      this.tokenInformation = response.data;
      this.saveTokenToPersistentStorage();

      if (response.state) {
        window.history.pushState('', '', response.state);
      }

      return true;
    }

    /**
     * Redirect to the oath provider
     * if we do not have a valid token
     * or way to generate it
     */
    if (!hasAuthorizeValues && !hasPersistedToken) {
      this.redirectToExternalProvider();
    }

    return false;
  }

  redirectToExternalProvider(location = null) {
    const queryParams = [
      `client_id=${this.clientId}`,
      'response_type=code',
      `redirect_uri=${this.redirectUrl}`,
      `scope=email`,
      `state=${this.getCurrentRoutingState()}`
    ];
    const queryString = `?${queryParams.join('&')}`;
    const authorizationServer = `${this.authorizationDomain}${this.authorizeEndpoint}`;

    if (location !== null) {
      window.location.href = `${this.authorizationDomain}${location}${queryString}`;
      return null;
    }

    window.location.href = authorizationServer + queryString;
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  async killSession() {
    /**
     * Remove the now invalidated tokens from the
     * browser storage
     */
    localStorage.removeItem(LOCALSTORAGE_KEY_OAUTH_TOKEN);

    /**
     * Redirect to external provider so
     * login can commence again
     */
    this.redirectToExternalProvider('/oauth/logout');
  }

  /**
   *
   */
  // eslint-disable-next-line class-methods-use-this
  getCurrentRoutingState() {
    const currentState = window.location.pathname;

    /**
     * If you are entering trough
     * the default route we don't send
     * the state
     */
    if (currentState === '/') {
      return '';
    }

    return currentState;
  }

  /**
   * Get the token for usage within the application
   */
  async getToken() {
    if (this.accessTokenIsExpired()) {
      await this.refreshToken();
    }

    return this.tokenInformation;
  }

  /**
   * Check if the access token is expired
   *
   * @return {boolean}
   */
  accessTokenIsExpired() {
    const currentTime = new Date().getTime();

    if (this.tokenInformation.tokenExpireTime && currentTime >= this.tokenInformation.tokenExpireTime) {
      return true;
    }

    return false;
  }

  /**
   * Check if we have the correct
   * data to refresh our token
   * @return {boolean}
   */
  refreshGrantIsAvailable() {
    if (!this.tokenInformation.refresh_token) {
      return false;
    }
    const currentTime = new Date().getTime();
    if (this.tokenInformation.refreshExpireTime && this.tokenInformation.refreshExpireTime > currentTime) {
      return false;
    }

    return true;
  }

  /**
   * Attempt to refresh the token
   * @return {Promise<boolean>}
   */
  async refreshToken() {
    if (this.tokenInformation.refresh_token === null) {
      throw new Error('You are trying to refresh a non existing token');
    }

    const tokenRequest = authorizationApi.post(
      this.tokenEndpoint,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.tokenInformation.refresh_token,
        client_id: this.clientId,
        client_secret: this.clientSecret
      })
    );

    const response = await tokenRequest.catch((err) => {
      console.log('Refresh token request has failed, response:', err);
    });

    if (response.status >= 200 && response < 300) {
      this.tokenInformation = response.data;
      this.saveTokenToPersistentStorage();
    }

    if (response.status >= 400) {
      await this.killSession();
      throw new Error('The /token request has failed');
    }

    return true;
  }

  /**
   * Get the values generated in the first
   * step of the authorize flow.
   *
   * (So this is where we get back to after logging in to the backend)
   */
  getAuthorizeValuesFromQuery() {
    const queryString = new URLSearchParams(window.location.search);

    if (queryString.has('code')) {
      this.authorizationCode = queryString.get('code');
      return true;
    }

    return false;
  }

  /**
   * Get the token (if exists) from a persistent source
   * this is usefull when opening multiple tabs
   */
  getTokenFromPersistentStorage() {
    if (localStorage.getItem(LOCALSTORAGE_KEY_OAUTH_TOKEN)) {
      this.tokenInformation = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_OAUTH_TOKEN));

      return true;
    }

    return false;
  }

  /**
   * Save the token to persistent storage
   * (currently localstorage, might go to session soon)
   * so please dont rely on the underlying value location!!
   */
  saveTokenToPersistentStorage() {
    const currentTime = new Date();
    const tokenExpireTime = currentTime;
    const refreshExpireTime = currentTime;

    tokenExpireTime.setSeconds(tokenExpireTime.getSeconds() + this.tokenInformation.expires_in);
    refreshExpireTime.setSeconds(refreshExpireTime.getSeconds() + 1209500);

    this.tokenInformation.tokenExpireTime = tokenExpireTime.getTime();
    this.tokenInformation.refreshExpireTime = refreshExpireTime.getTime();
    const jsonFormattedToken = JSON.stringify(this.tokenInformation);
    localStorage.setItem(LOCALSTORAGE_KEY_OAUTH_TOKEN, jsonFormattedToken);
  }
}
