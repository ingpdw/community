/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';
import Observer from 'js-observer';

class CommentRemove{
	constructor( $parent ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.onRemove = new Observer;
		this.addEvent();
  }

	addEvent(){
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommentCommonWrap .btn-delete`, ( evt ) => {
			Util.confirm( Config.L10N.alert_delete_article, () => {
				let _$this = jQuery( evt.currentTarget );
				let $removeNode = _$this.parent().parent();
				let isReply = $removeNode.hasClass( 'comment-article-reply' );
				let commentId = _$this.attr( 'data-commentid' );
				this.remove( commentId, $removeNode, isReply );
			}, () => {});
		});
	}

	setRemoveAndParentCommentCount( $removeNode, isReply ){
		let $parent = $removeNode.prevAll( '.comment-article, .comment-article-delete' ).first();
		let $parentCount = $parent.find( '.co-btn-comments .text' );
		let count = parseInt( $parentCount.text() ) - 1;

		if( isReply ){
			( count && count > 0 )?
				$parentCount.text( count ):
				$parentCount.text( 0 );
			$removeNode.remove();
		}else{
			$removeNode.replaceWith( Template.commentRemove() );
		}
	}

	remove( commentId, $removeNode, isReply = false ){
		let _post = Util.get( Config.commentRemove( {'board': Config.board, articleId: this.articleId, commentId: commentId} ), 'DELETE' );
		_post.then( ( data ) => {
			this.setRemoveAndParentCommentCount( $removeNode, isReply );
			this.onRemove.emit();
		}, ( data ) => {
			Config.apiError( data );
		});
	}
};

module.exports = CommentRemove;
