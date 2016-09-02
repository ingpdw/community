/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';
import Observer from 'js-observer';

class CommentReload{
	constructor( $parent ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.addEvent();
		this.onReload = new Observer();
  }

	addEvent(){
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommentCommonWrap .co-btn-reload`, ( evt ) => {
			this.onReload.emit();
		});
	}

	remove( commentId, $removeNode ){
		let _post = Util.get( Config.commentRemove( {'board': Config.board, articleId: this.articleId, commentId: commentId} ), 'DELETE' );
		_post.then( ( data ) => {
			$removeNode.remove();
		}, ( data ) => {
			Config.apiError( data );
		});
	}
};

module.exports = CommentReload;
