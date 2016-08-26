/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class CommentWrite{
	constructor( $parent, callback ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.callback = callback;
		this.id = 'contentWrite';
  }
	setUI(){
		let write = Template.commentWrite( this.id );
		jQuery( 'body' ).on( 'keypress', `#${this._id} .${this.id}` , ( evt ) => {
			var key = evt.keyCode;
			if( key == 13 ){
				evt.preventDefault();
				let _$this = jQuery( `#${this._id} .${this.id}` );
				this.submit({
					contents: _$this.val()
				}, () => {});
			}else{
			}
		});

		jQuery( 'body' ).on( 'focus', `#${this._id} .${this.id}` , ( evt ) => {
			if( !window.guid ){
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
			this.callback && this.callback( data );
		}, ( data ) => {
			Config.apiError( data );
		});
	}
};

module.exports = CommentWrite;
