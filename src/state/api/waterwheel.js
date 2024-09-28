import { Base } from './helpers/base';
import { Request } from './helpers/request';
import { JSONAPI } from './jsonapi';

// TODO: Extra functionality: option to save token, Option to use jsonapi and rest calls, method to check if username/passwd is valid

export class Waterwheel extends Base {
  /**
   * Create an instance of the Waterwheel class.
   * @param {object} options
   *   The configuration used to create a new instance of Waterwheel.
   * @param {string} options.base
   *   The base URL.
   * @param {object} options.oauth
   *   The credentials used with each request.
   * @param {string} options.oauth.grant_type
   *   The type of grant you are requesting.
   * @param {string} options.oauth.client_id
   *   The ID of the OAuth Client.
   * @param {string} options.oauth.client_secret
   *   The secret set when the Client was created.
   * @param {string} options.oauth.username
   *   The resource owner username.
   * @param {string} options.oauth.password
   *   The resource owner password.
   * @param {string} options.oauth.scope
   *   The scope of the access request.
   * @param {string} options.timeout
   *   How long AXIOS should wait before bailing on a request.
   * @param {string} options.jsonapiPrefix
   *   If you have overridden the JSON API prefix, specify it here and Waterwheel
   *   will use this over the default of 'jsonapi'.
   * @param {boolean} options.validation
   *   Should the request use oauth validation or expect anonymous access.
   */
  constructor(options) {
    super(options);
    this.oauth = window.clientInstance;
    this.request = new Request(options, this.oauth);
    this.jsonapi = new JSONAPI(options, this.request);
  }
}
