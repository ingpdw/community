/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class CommentReply{
	constructor( $parent ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.commentId = '';
		this.currTarget = '';
		this.removeCommentId = '';
		this.$write = '';
  }
	setUI(){
		let id = 'contentReply';
		this.$write = jQuery( Template.commentWrite( id ) );

		jQuery( 'body' ).on( 'focus', `#${this._id} .${id}` , ( evt ) => {
			if( !window.guid ){
				jQuery( `#${this._id} .${id}` ).blur();
				Config.apiError( {status: 401} );
				return;
			}
		});

		//Enter Key Event
		jQuery( 'body' ).on( 'keypress', `#${this._id} .${id}` , ( evt ) => {
			var key = evt.keyCode;
			if( key == 13 ){
				evt.preventDefault();
				let _$this = jQuery( `#${this._id} .${id}` );

				this.submit({
					commentId: this.commentId,
					contents: _$this.val()
				}, ( data ) => {

					if( data.number ){
						let item = {
							commentList: [{
								depth: 1,
								commentId: data.number || '',
								updateDate: data.generatedDate || '',
								contents: _$this.val() || '',
								goodCount: 0,
								replyCount: 0,
								writer: {
									loginUser: {
										uid: window.guid || '',
										name: window.nickname || ''
									}
								}
							}]
						};

						let _comment = Template.commentList( item );
						let _$article = jQuery( `#${this._id} .comment-article[data-commentid=${this.commentId}]` );
						let _$articleComments = _$article.nextAll( '.comment-article:first' );

						( _$articleComments.length )?
							_$articleComments.before( _comment ):
							_$article.after( _comment );

						//It's hell...
						let commentCount = _$article.find( '.co-btn-comments .text' );
						commentCount.text( parseInt( commentCount.text() || '0' ) + 1 );
						_$this.val( '' );
					}
				});
			}else{
			}
		});

		//reply comment Event
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommentCommonWrap .co-btn-comments`, ( evt ) => {
			let _$this = jQuery( evt.currentTarget );
			this.currTarget = _$this.parent().parent();
			this.commentId = _$this.attr( 'data-commentid' );
			this.currTarget.append( this.$write.show() );
		});

		//return jquery Node
		return this.$write;

	}

	submit( data, callback ){
		let _post = Util.get( Config.comment( {'board': Config.board, articleId: this.articleId} ), 'POST', data );
		_post.then( ( data ) => {
			callback && callback( data );
		}, ( data ) => {
			Config.apiError( data );
		});
	}

};

module.exports = CommentReply;
