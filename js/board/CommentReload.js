/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class CommentReload{
	constructor( $parent, callback ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.callback = callback;
		this.addEvent();
  }

	addEvent(){
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommentCommonWrap .co-btn-reload`, ( evt ) => {
			this.callback && this.callback();
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
