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

		window.uploadImageCallback = this.uploadImageCallback = new UploadImageCallback( () => {
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
};

module.exports = UploadImageToolbar;
