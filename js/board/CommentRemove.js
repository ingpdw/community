/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class CommentRemove{
	constructor( $parent ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.addEvent();
  }

	addEvent(){
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommentCommonWrap .btn-delete`, ( evt ) => {
			Util.confirm( '정말로 삭제하시겠습니까?', () => {
				let _$this = jQuery( evt.currentTarget );
				let $removeNode = _$this.parent().parent();
				let isReplay = $removeNode.hasClass( 'comment-article-reply' );
				let commentId = _$this.attr( 'data-commentid' );
				this.remove( commentId, $removeNode, isReplay );

			}, () => {});
		});
	}

	setCommentCount( $removeNode ) {
		let $parentComment = '', //parent Comment
				$commentText = '',
				$commentCount = 0;

		$parentComment = $removeNode.prevAll( '.comment-article:first' );
		$commentText = $parentComment.find( '.co-btn-comments .text' );
		$commentCount = parseInt( $commentText.text() ) - 1;
		if( !isNaN( $commentCount )  && $commentCount  > 0 ){
			$commentText.text( $commentCount );
		}else{
			$commentText.text( '0' );
		}
	}

	remove( commentId, $removeNode, isReplay = false ){
		let _post = Util.get( Config.commentRemove( {'board': Config.board, articleId: this.articleId, commentId: commentId} ), 'DELETE' );
		_post.then( ( data ) => {

			//set replay count
			if( isReplay ) {
				this.setCommentCount( $removeNode );
				$removeNode.remove();
			}else{
				$removeNode.replaceWith( Template.commentRemove() );
			}

			//It's hell...
			let $count = jQuery( `${this._id} .commentTotalCount` );
			$count.text( parseInt( $count.text() || '1'  )  - 1  );
		}, ( data ) => {
			Config.apiError( data );
		});
	}
};

module.exports = CommentRemove;
