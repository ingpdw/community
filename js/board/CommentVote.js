/**
 * VOTE
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class CommentVote{
	constructor( $parent ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId =  Util.getParams().articleId;;
		this._$this = '';
		this.addEvent();
  }

	addEvent() {
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommentCommonWrap .co-btn-like`, ( evt ) => {
			this._$this = jQuery( evt.currentTarget );
			this.commentId = this._$this.attr( 'data-commentid' );
			this.vote();
		});
	}

	setChangeUI( data ) {
		if( data != -1 ){
			this._$this.find( '.text' ).text( data );
		}
	}

  vote(){
		let _post = Util.get( Config.voteComment({
			board: Config.board,
			articleId: this.articleId,
			commentId: this.commentId
		}), 'POST');
		_post.then( ( data ) => {
				if( data != -1 ){
					this.setChangeUI( data );
					this._$this.addClass( 'is-active' );
				}else if( data == -1 ){
					this.voteCancel();
				}
		}, ( data ) => {
			Config.apiError( data );
		});
	}

	voteCancel(){
		let _post = Util.get( Config.voteComment({
			board: Config.board,
			articleId: this.articleId,
			commentId: this.commentId}), 'DELETE');
		_post.then( ( data ) => {
			if( data != -1 ){
				this._$this.removeClass( 'is-active' );
				this.setChangeUI( data );
			}else if( data == -1 ){
				this._$this.removeClass( 'is-active' );
				this.vote();
			}
		}, ( data ) => {
			Config.apiError( data );
		});
	}

};

module.exports = CommentVote;
