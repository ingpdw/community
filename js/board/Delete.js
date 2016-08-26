/**
 * Delete
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class Delete{
	constructor( guid ){
		this.guid = guid;
		this.articleId = Util.getParams().articleId;
		this.selector = '#viewMoreList .co-btn-delete';
		this.show();
		this.addEvent();
  }

	template(){
		return `<li class="more-items"><button class="co-btn co-btn-delete">삭제</button></li>`;
	}

	show(){
		if( window.guid != this.guid )
			jQuery( this.selector ).hide();
	}

	addEvent(){
		jQuery( 'body' ).on( 'click', this.selector, ( evt ) => {
			evt.preventDefault();
			Util.confirm( '정말로 삭제하시겠습니까?', () => {
				this.deleteArticle( ( bool ) => {
					if( bool ){
							alert( '삭제되었습니다.');
							location.href = Config.listPage;
					}else{
						alert( '삭제되지 않았습니다.');
					}
				});
			}, () => {});
		});
	}

  deleteArticle( callback ){
		let _post = Util.get( Config.delete({
			board: Config.board,
			articleId: this.articleId}), 'DELETE' );
		_post.then( ( data ) => {
			callback && callback( data );
		}, ( data ) => {
			Config.apiError( data );
		});
	}
};

module.exports = Delete;
