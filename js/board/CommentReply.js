/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';
import Observer from 'js-observer';

class CommentReply{
	constructor( $parent ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.commentId = '';
		this.currTarget = '';
		this.removeCommentId = '';
		this.$write = '';

		this.onReply = new Observer;
  }
	setUI(){
		let id = 'contentReply';
		this.$write = jQuery( Template.commentWrite( id, Config.L10N.comment_reply_placeholder_login ) );

		jQuery( 'body' ).on( 'focus', `#${this._id} .${id}` , ( evt ) => {
			if( !Config.guid ){
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

				let _val = _$this.val();

				if( _val.length == 0 ){
					alert( Config.L10N.alert_empty_reply );
					return;
				}

				if( _val.length > 300 ){
					alert( Config.L10N.comment_placeholder_login );
					return;
				}

				this.submit({
					commentId: this.commentId,
					contents: _val
				}, ( data ) => {

					if( data.number ){
						let item = {
							commentList: [{
								depth: 1,
								commentId: data.number || '',
								postDate: data.generatedDate || '',
								updateDate: data.generatedDate || '',
								contents: _val || '',
								goodCount: 0,
								replyCount: 0,
								writer: {
									loginUser: {
										uid: Config.guid || '',
										name: Config.nickName || ''
									}
								}
							}]
						};

						let _comment = Template.commentList( item, Config.L10N.a_few_seconds_ago );
						let _$article = jQuery( `#${this._id} .comment-article[data-commentid=${this.commentId}]` );
						let _$articleComments = _$article.nextAll( '.comment-article:first, .comment-article-delete:first' ).first();

						( _$articleComments.length )?
							_$articleComments.before( _comment ):
							_$article.after( _comment );

						//It's hell...
						let commentCount = _$article.find( '.co-btn-comments .text' );
						commentCount.text( parseInt( commentCount.text() || '0' ) + 1 );
						_$this.val( '' );

						this.onReply.emit();
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

			this.$write.find( 'textarea' ).val( '' );
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
