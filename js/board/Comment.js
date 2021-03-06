/**
 * Comment
 */

import Config from '../Config';
import Util from '../Util';
import InfiniteScroll from '../InfiniteScroll';
import Template from './Template';
import Loading from '../Loading';
import CommentWrite from './CommentWrite';
import CommentReply from './CommentReply';
import CommentVote from './CommentVote';
import CommentRemove from './CommentRemove';
import CommentReload from './commentReload';
import CommentHeader from './CommentHeader';
import CommentListWrap from './CommentListWrap';
import CommentReport from './CommentReport';
import CommentMore from './CommentMore';
import Tmpl from 'js-template-string';

class Comment{
	constructor( node, options ){
		this.$node = node;

		this._id = this.$node.attr( 'id' );

		Config.board = ( options.board )?
			options.board: Config.board;

		Config.commentVote = ( options.commentAPIUrl )?
			options.commentAPIUrl: Config.commentVote;

		Config.isApp = ( options.isApp )?
			options.isApp: false;

		jQuery.extend( true, Config, options );

		//like button
		this.commentVote = new CommentVote( this.$node );

		//remove Comment Article
		this.commentRemove = new CommentRemove( this.$node );
		this.commentRemove.onRemove.add( () => {
			let totalCount = this.commentHeader.getCommentCount() - 1;
			this.commentHeader.setCommentCount(
				( totalCount && totalCount > 0 )?
					totalCount: 0 );
		}, this );

		//comment wrap UI
		this.commentListWrap = new CommentListWrap( this.$node );

		//reload comment
		this.commentReload = new CommentReload( this.$node );
		this.commentReload.onReload.add( () => {
			this.commentListWrap.empty();
			this.reloadComment();
		}, this );

		//comment count UI
		this.commentHeader = new CommentHeader( this.$node );

		//write comment
		this.commentWrite = new CommentWrite( this.$node )
		this.commentWrite.onWrite.add( () => {
			this.commentListWrap.empty();
			this.reloadComment( true );
			this.commentWrite.clear();
		}, this );

		//comment Reply
		this.commentReply = new CommentReply( this.$node );
		this.commentReply.onReply.add( () => {
			this.commentHeader.setCommentCount( this.commentHeader.getCommentCount() + 1 );
		}, this );


		//comment report UI
		this.commentReport = new CommentReport( this.$node, jQuery( 'body' ) );

		//more button
		this.commentMore = new CommentMore( this.$node);
		this.commentMore.onMore.add( ( data ) => {
			this.commentListWrap.appendList( Template.commentList( data ) );
			this.myLikeComment( data.likeCommentIds );
		}, this );

		//loading spinner
		this.loading = new Loading( this.$node );
		this.loading.setUI();
  }

	myLikeComment( data ){
		if( !data || data.length == 0 ) return;
		// for( let item of data ){
		// 	$( `#${this._id} button.co-btn-like[data-commentid=${item}]` ).addClass( 'is-active' );
		// }

		data.forEach( ( item ) =>  {
			$( `#${this._id} button.co-btn-like[data-commentid=${item}]` ).addClass( 'is-active' );
		});
	}

  reloadComment( isWrite = false ){
		let articleId = Util.getParams().articleId;
		let commentUrl = Tmpl.render({
	      data: {
					articleId: articleId,
					board: Config.board
				},
	      template: Config.commentVote
	  });

    let comment = Util.get( commentUrl );
    comment.then( ( data ) => {

			data = Util.convertCamelCase( data );

			let body = Template.commentList( data );
			this.commentHeader.setCommentCount(
				( data.pageNavigation )? data.pageNavigation.totalCount + data.pageNavigation.replyCount: 0 );
			this.commentListWrap.appendList( body );

			if( isWrite ){
				//writed comments - a few seconds ago
				let writingComment = this.$node.find( '.commentThread :first' );

				writingComment.find( '.date' ).text( Config.L10N.a_few_seconds_ago );
				writingComment.addClass( 'is-highlight' );
			}

    }, ( data ) => {
			if( data.status == 400 ){
				location.href = Config.listPage;
			}

			if( data.status == 401 ){
				Config.apiError( data );
			}
		})
  }

  get(){
		this.loading.show();

		let _param = Util.getParams();

		let articleId = _param.articleId;

		//if This article is notice Article, it has done.
		if( _param.isNotice == '1' ){
			this.loading.hide();
			return;
		}

		let commentUrl = Tmpl.render({
	      data: {articleId: articleId, board: Config.board},
	      template: Config.commentVote
	  });

    let comment = Util.get( commentUrl );
    comment.then( ( data ) => {

			data = Util.convertCamelCase( data );

			//set comment Header UI
			let header =  this.commentHeader.setUI( data.pageNavigation || data.commentPagination );

			//set comment write textare UI
			let write = this.commentWrite.setUI();

			//set comment Reply textarea UI
			let commentReply = this.commentReply.setUI();

			//set comment List UI
			let body = this.commentListWrap.setUI( Template.commentList( data ) );

			//set comment more button UI
			let more = this.commentMore.setUI();

			//merge comment Template String
			let wrapComment = Template.comment( header + write + body + more );

			this.$node.append( wrapComment );
			this.$node.append( commentReply.hide() );

			this.myLikeComment( data.likeCommentIds );

			//If it's the last page, remove more button
			if( ( data.pageNavigation && data.pageNavigation.endPage <= 1 ) ||
					( data.commentPagination && data.commentPagination.endPage <= 1 )	){
				this.commentMore.remove();
			}

			this.loading.hide();

    }, () => {

			this.loading.hide();

		})
  }
};

module.exports = Comment;
