/**
 * UploadImageCallback
 */

import Config from './Config.js';
import Observer from 'js-observer';

class UploadImageCallback {
  constructor( callback ) {
    this.actionUrl = '';
    this.callback = callback;
  }
  getActionUrl () {
    return this.actionUrl;
  }
  setActionUrl ( url ) {
    this.actionUrl = url;
  }
  onSuccess () {
    this.callback();
  }
  onFileServerError () {
    return `${Config.L10N.error_file_server}`;
  }
  onExceedMaxUpload () {
    return `${Config.L10N.error_exceed_max_upload}`;
  }
  onExceedFileSize () {
    return `${Config.L10N.error_exceed_file_size}`;
  }
  onExceedFileSize3M () {
    return `${Config.L10N.error_exceed_file_size_3m}`;
  }
  onInvalidRequest () {
    return `${Config.L10N.error_invalid_request}`;
  }
  onInvalidChannel () {
    return `${Config.L10N.error_invalid_channel}`;
  }
  onInvalidType () {
    return `${Config.L10N.error_invalid_type}`;
  }
  onInvalidToken () {
    return `${Config.L10N.error_invalid_token}`;
  }
  onExpiredToken () {
    return `${Config.L10N.error_expired_token}`;
  }
  onExceedFile () {
    return `${Config.L10N.error_exceed_file}`;
  }
  onAuthFail () {
    return `${Config.L10N.error_auth_fail}`;
  }
}

module.exports = UploadImageCallback;
