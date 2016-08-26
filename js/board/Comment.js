/**
 * Comment
 */

import Config from '../Config.js';
import Util from '../Util.js';
import InfiniteScroll from '../InfiniteScroll.js';
import Template from './Template.js';
import Loading from '../Loading';
import CommentWrite from './CommentWrite.js';
import CommentReply from './CommentReply.js';
import CommentVote from './CommentVote.js';
import CommentRemove from './CommentRemove.js';
import CommentReload from './commentReload.js';
import CommentHeader from './CommentHeader.js';
import CommentListWrap from './CommentListWrap.js';
import CommentReport from './CommentReport.js';
import CommentMore from './CommentMore.js';
import Tmpl from 'js-template-string';

class Comment{
	constructor( node, options ){
		this.$node = node;
		this._id = this.$node.attr( 'id' );
		this.commentReply = new CommentReply( this.$node );
		this.commentVote = new CommentVote( this.$node );
		this.commentRemove = new CommentRemove( this.$node );
		this.commentListWrap = new CommentListWrap( this.$node );
		this.commentReload = new CommentReload( this.$node, () => {
			this.commentListWrap.empty();
			this.reloadComment();
		});
		this.commentWrite = new CommentWrite( this.$node, ()=> {
			this.commentListWrap.empty();
			this.reloadComment();
			this.commentWrite.clear();
		});
		this.commentHeader = new CommentHeader( this.$node );
		this.commentReport = new CommentReport( this.$node, jQuery( 'body' ) );
		this.commentMore = new CommentMore( this.$node, ( data ) => {
			this.commentListWrap.appendList( Template.commentList( data ) );
			this.myLikeComment( data.likeCommentIds );
		});

		Config.board = ( options.board )? options.board: Config.board;

		this.loading = new Loading( this.$node );
		this.loading.setUI();
  }

	myLikeComment( data ){
		if( !data || data.length == 0 ) return;
		for( let item of data ){
			$( `#${this._id} button.co-btn-like[data-commentid=${item}]` ).addClass( 'is-active' );
		}
	}

  reloadComment(){
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
			let body = Template.commentList( data );
			this.commentHeader.setCommentCount( data.pageNavigation.totalCount );
			this.commentListWrap.appendList( body );

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

		//if This article is notice Article,
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
			let header =  this.commentHeader.setUI( data.pageNavigation );
			let write = this.commentWrite.setUI();
			let commentReply = this.commentReply.setUI();
			let body = this.commentListWrap.setUI( Template.commentList( data ) );
			let more = this.commentMore.setUI();
			let wrapComment = Template.comment( header + write + body + more );
			this.$node.append( wrapComment );
			this.$node.append( commentReply.hide() );

			this.myLikeComment( data.likeCommentIds );

			if( data.pageNavigation.endPage <= 1 ){
				this.commentMore.remove();
			}

			this.loading.hide();

    }, () => {

			this.loading.hide();

		})
  }



};

module.exports = Comment;
