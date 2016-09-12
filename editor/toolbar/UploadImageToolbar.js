/**
 * Update
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Toolbar from '../toolbar/Toolbar.js';
import UploadImageCallback from '../UploadImageCallback.js';
import Observer from 'js-observer';

class UploadImageToolbar extends Toolbar{
	constructor () {
		super();
		this.uploadUrl = '';
		this.tokenId = '';
		this.onImage = new Observer;
		this.isUploading = false; //is uploading

		window.uploadImageCallback = this.uploadImageCallback = new UploadImageCallback( ( err ) => {

			if( err ){
				this[err] && this[err]();
				return;
			}

			let url = '';
			//option에  token 정보가 있다면
			if( Config.options &&  Config.options.fileInfoUrl ){
				url = Config.options.fileInfoUrl;
			}else{
				url = Config.getTokenFileInfo({ board: Config.board, tokenId: this.tokenId });
			}
			let _post = Util.get( url, 'GET' );
			_post.then( ( data )=> {
				let item = data[ data.length - 1 ];
				this.onImage.emit( item );
			}, ( data ) => {
				if( data.result && data.result.exceptionClassName == 'AccessDeniedException' ){
						alert( data.result.message );
				}
			});
		});
	}

	//option에 token 정보가 있다면
	getTokenByOption(){
		let url = Config.options && Config.options.uploadUrl
		this.uploadImageCallback.setActionUrl( url );
	}

	getTokenString(){
		return this.tokenId || '';
	}

	getToken(){
		let url = Config.createToken({ board: Config.board });
		let _post = Util.get( url, 'POST' );
		_post.then( ( data )=> {
			this.uploadUrl = data.uploadUrl;
			this.tokenId = data.tokenId;
			this.uploadImageCallback.setActionUrl( this.uploadUrl );
		}, ( data ) => {
				Config.apiError( data, Config.loginPage );
		});
	}

	getTokenFileInfo(){
		let url = Config.getTokenFileInfo({ board: Config.board });
		let _post = Util.get( url, 'POST' );
		_post.then( ( data )=> {
		}, () => {});
	}

	onValidUpload () {
		alert( `${Config.L10N.alert_valid_upload}` );
	}
  onFileServerError () {
    alert( `${Config.L10N.error_file_server}` );
  }
  onExceedMaxUpload () {
    alert( `${Config.L10N.error_exceed_max_upload}` );
  }
  onExceedFileSize () {
    alert( `${Config.L10N.error_exceed_file_size}` );
  }
  onExceedFileSize3M () {
    alert( `${Config.L10N.error_exceed_file_size_3m}` );
  }
  onInvalidRequest () {
    alert( `${Config.L10N.error_invalid_request}` );
  }
  onInvalidChannel () {
    alert( `${Config.L10N.error_invalid_channel}` );
  }
  onInvalidType () {
    alert( `${Config.L10N.error_invalid_type}` );
  }
  onInvalidToken () {
    alert( `${Config.L10N.error_invalid_token}` );
  }
  onExpiredToken () {
    alert( `${Config.L10N.error_expired_token}` );
  }
  onExceedFile () {
    alert( `${Config.L10N.error_exceed_file}` );
  }
  onAuthFail () {
    alert( `${Config.L10N.error_auth_fail}` );
  }

};

module.exports = UploadImageToolbar;
