/**
 * UploadImageCallback
 */

import Observer from 'js-observer';

class UploadImageCallback {
  constructor( callback ) {
    this.actionUrl = '';
    this._isUploading = false;
    this.callback = callback;

    this.onUploaded = new Observer;

    this.onUploading = new Observer;
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
    //   this.onUploaded.emit( 'onValidUpload' );
    //   this.onReset();
    //   return true;
    // }

    this.onUploading.emit();
    return false;
  }

  onSuccess () {
    this.onUploaded.emit();
    this.onReset();
  }
  onFileServerError () {
    this.onUploaded.emit( 'onFileServerError' );
    this.onReset();
  }
  onExceedMaxUpload () {
    this.onUploaded.emit( 'onExceedMaxUpload' );
    this.onReset();
  }
  onExceedFileSize () {
    this.onUploaded.emit( 'onExceedFileSize' );
    this.onReset();
  }
  onExceedFileSize3M () {
    this.onUploaded.emit( 'onExceedFileSize3M' );
    this.onReset();
  }
  onInvalidRequest () {
    this.onUploaded.emit( 'onInvalidRequest' );
    this.onReset();
  }
  onInvalidChannel () {
    this.onUploaded.emit( 'onInvalidChannel' );
    this.onReset();
  }
  onInvalidType () {
    this.onUploaded.emit( 'onInvalidType' );
    this.onReset();
  }
  onInvalidToken () {
    this.onUploaded.emit( 'onInvalidToken' );
    this.onReset();
  }
  onExpiredToken () {
    this.onUploaded.emit( 'onExpiredToken' );
    this.onReset();
  }
  onExceedFile () {
    this.onUploaded.emit( 'onExceedFile' );
    this.onReset();
  }
  onAuthFail () {
    this.onUploaded.emit( 'onAuthFail' );
    this.onReset();
  }
}

module.exports = UploadImageCallback;
