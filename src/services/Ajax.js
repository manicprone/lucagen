import requestPromise from 'request-promise';
import objectUtils from '../utils/object-utils';

export default class Ajax {
  constructor(options) {
    this.debug = objectUtils.get(options, 'debug', false);
    this.module = objectUtils.get(options, 'module', null);
    this.baseURL = objectUtils.get(options, 'baseURL', '');
  }

  get(uri, options) {
    return this.request(uri, { method: 'GET', ...options });
  }

  post(uri, options) {
    return this.request(uri, { method: 'POST', ...options });
  }

  delete(uri, options) {
    return this.request(uri, { method: 'DELETE', ...options });
  }

  request(uri, options) {
    const url = `${this.baseURL}${uri}`;
    const method = options.method || 'GET';
    const headers = {};
    const qs = options.query;
    const body = options.data;

    return requestPromise({
      json: true,
      uri: url,
      method,
      headers,
      qs,
      body,
    });
  }
}
