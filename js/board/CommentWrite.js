/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';
import Observer from 'js-observer';

class CommentWrite{
	constructor( $parent ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.id = 'contentWrite';

		this.onWrite = new Observer;
  }
	setUI(){
		let write = Template.commentWrite( this.id );
		jQuery( 'body' ).on( 'keypress', `#${this._id} .${this.id}` , ( evt ) => {
			var key = evt.keyCode;
			if( key == 13 ){
				evt.preventDefault();
				let _$this = jQuery( `#${this._id} .${this.id}` );
				let _val = _$this.val();

				if( _val.length == 0 ){
					alert( Config.L10N.alert_empty_comment );
					return;
				}

				if( _val.length > 300 ){
					alert( Config.L10N.comment_placeholder_login );
					return;
				}

				this.submit({
					contents: _val
				}, () => {});
			}else{
			}
		});

		jQuery( 'body' ).on( 'focus', `#${this._id} .${this.id}` , ( evt ) => {
			if( !Config.guid ){
				jQuery( `#${this._id} .${this.id}` ).blur();
				Config.apiError( {status: 401} );
				return;
			}
		});

		return write;
	}

	getNode(){
		return jQuery( `#${this._id} .${this.id}` );
	}

	clear(){
		jQuery( `#${this._id} .${this.id}` ).val( '' );
	}

	submit( data ){
		let _post = Util.get( Config.comment( {'board': Config.board, articleId: this.articleId} ), 'POST', data );
		_post.then( ( data ) => {
			this.onWrite.emit( data );
		}, ( data ) => {
			Config.apiError( data );
		});
	}
};

module.exports = CommentWrite;
