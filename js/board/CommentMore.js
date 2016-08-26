/**
 * Comment
 */

import Config from '../Config.js';
import Util from '../Util.js';
import InfiniteScroll from '../InfiniteScroll.js';
import Template from './Template.js';
import Loading from '../Loading';
import Tmpl from 'js-template-string';

class CommentMore{
	constructor( $node, callback ){
		this.$node = $node;
		this._id = this.$node.attr( 'id' );
		this.callback = callback;
		this.infiniteScroll = new InfiniteScroll( ( dir ) => {
			if( dir == 'down' ) this.get();
		});
		this.addEvent();

		this.loading = new Loading( this.$node );
  }

	setUI() {
		return `<button class="ncCommmentMore">더보기</button>`;
	}

	remove() {
		jQuery( `#${this._id} .ncCommmentMore` ).hide();
	}

	addEvent() {
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommmentMore`, ( evt ) => {
			this.get();
			this.remove();
			this.infiniteScroll.start();
			this.loading.setUI();
		});
	}

	get() {
		this.loading.show();

		let articleId = Util.getParams().articleId;
		let commentId = jQuery( `#${this._id} .comment-article:last` ).attr( 'data-commentid' );
		let commentMoreUrl = Tmpl.render({
				data: {
					articleId: articleId,
					commentId: commentId,
					board: Config.board,
					moreDirection: 'BEFORE'
				},
				template: Config.commentMoreVote
		});

		let commentMore = Util.get( commentMoreUrl );
		commentMore.then( ( data ) => {

			if( !data.hasMore ){
				this.infiniteScroll.stop( 'down' );
			}

			this.callback && this.callback( data );
			this.infiniteScroll.loadedEnd();

			this.loading.hide();
		}, () => {
			this.infiniteScroll.loadedEnd();
			this.loading.hide();
		});
	}

	getVote(){
		let articleId = Util.getParams().articleId;
		let commentVoteUrl = Tmpl.render({
	      data: {articleId: articleId, board: Config.board},
	      template: Config.commentMoreVote
	  });

		let commentVote = Util.get( commentVoteUrl );
		commentVote.then( ( data ) => {
		}, () => {});
	}
};

module.exports = CommentMore;
