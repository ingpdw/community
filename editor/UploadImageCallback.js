/**
 * UploadImageCallback
 */

import Observer from 'js-observer';

class UploadImageCallback {
  constructor( callback ) {
    this.actionUrl = '';
    this._isUploading = false;
    this.callback = callback;
  }
  getActionUrl () {
      return this.actionUrl;
  }

  onReset(){
    this._isUploading = false;
  }

  setActionUrl ( url ) {
    this.actionUrl = url;
  }

  isUploading(){
    // if( !this._isUploading ){
    //   this._isUploading = true;
    //   return false;
    // }else{
    //   this.callback && this.callback( 'onValidUpload' );
    //   this.onReset();
    //   return true;
    // }

    return false;
  }

  onSuccess () {
    this.callback && this.callback();
    this.onReset();
  }
  onFileServerError () {
    this.callback && this.callback( 'onFileServerError' );
    this.onReset();
  }
  onExceedMaxUpload () {
    this.callback && this.callback( 'onExceedMaxUpload' );
    this.onReset();
  }
  onExceedFileSize () {
    this.callback && this.callback( 'onExceedFileSize' );
    this.onReset();
  }
  onExceedFileSize3M () {
    this.callback && this.callback( 'onExceedFileSize3M' );
    this.onReset();
  }
  onInvalidRequest () {
    this.callback && this.callback( 'onInvalidRequest' );
    this.onReset();
  }
  onInvalidChannel () {
    this.callback && this.callback( 'onInvalidChannel' );
    this.onReset();
  }
  onInvalidType () {
    this.callback && this.callback( 'onInvalidType' );
    this.onReset();
  }
  onInvalidToken () {
    this.callback && this.callback( 'onInvalidToken' );
    this.onReset();
  }
  onExpiredToken () {
    this.callback && this.callback( 'onExpiredToken' );
    this.onReset();
  }
  onExceedFile () {
    this.callback && this.callback( 'onExceedFile' );
    this.onReset();
  }
  onAuthFail () {
    this.callback && this.callback( 'onAuthFail' );
    this.onReset();
  }
}

module.exports = UploadImageCallback;
