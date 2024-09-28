import axios from 'axios';

const authorizationApi = axios.create({
  timeout: 3000,
  baseURL: process.env.REACT_APP_OAUTH_PROVIDER_DOMAIN
});

export default authorizationApi;
