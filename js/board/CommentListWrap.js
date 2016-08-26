/**
 * CommentListWrap
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class CommentListWrap{
	constructor( $parent, callback ){
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		this.articleId = Util.getParams().articleId;
		this.callback = callback;
		this.id = 'commentThread';
  }

	template( list ){
		return Tmpl.render({
			data: list,
			template: ( list ) => `<div class="comment-body"><div class="commentThread comment-thread">${list}</div></div>`
		});
	}

	getNode(){
		return jQuery( `#${this._id} .${this.id}` );
	}

	empty(){
		jQuery( `#${this._id} .${this.id}` ).empty();
	}

	appendList( list ){
		jQuery( `#${this._id} .${this.id}` ).append( list );
	}

	setUI( data ){
		return this.template( data );
	}
};

module.exports = CommentListWrap;
