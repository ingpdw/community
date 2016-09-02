/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class CommentHeader{
	constructor( $parent/*, callback*/ ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		//this.callback = callback;
  }

	template( data ){
		return Tmpl.render({
			data: data,
			template: ( _v ) => `
				<div class="comment-header">
					<h3 class="comment-title">댓글<span class="commentTotalCount">${ ( _v.totalCount + _v.replyCount )}</span></h3>
					<button class="co-btn co-btn-reload"><i class="fe-icon-reload"></i></button>
				</div>
			`
		});
	}

	setUI( data ){
		let header =  this.template( data );
		return header;
	}

	getCommentCount(){
		let count = parseInt( jQuery( `#${this._id} .commentTotalCount` ).text() );
		if( count ){
			return count;
		}else{
			return 0;
		}
	}

	setCommentCount( totalCount ){
		jQuery( `#${this._id} .commentTotalCount` ).text( totalCount );
	}
};

module.exports = CommentHeader;
