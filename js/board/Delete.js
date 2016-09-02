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
		return `<li class="more-items"><button class="co-btn co-btn-delete">${Config.L10N.btn_delete}e</button></li>`;
	}

	show(){
		if( Config.guid != this.guid )
			jQuery( this.selector ).hide();
	}

	addEvent(){
		jQuery( 'body' ).on( 'click', this.selector, ( evt ) => {
			evt.preventDefault();
			Util.confirm( Config.L10N.alert_delete_article, () => {
				this.deleteArticle( ( bool ) => {
					if( bool ){
						location.href = Config.listPage;
					}else{
						alert( Config.L10N.alert_retry );
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
