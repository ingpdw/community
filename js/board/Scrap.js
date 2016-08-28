/**
 * Scrap
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class Scrap{
	constructor(){
		this.articleId = Util.getParams().articleId;
		this.targetUrl = location.href;
		this.addEvent();
  }

	template(){
		return `<li class="more-items"><button class="co-btn co-btn-bookmark">${Config.L10N.more_bookmar}</button></li>`;
	}

	addEvent(){
		jQuery( 'body' ).on( 'click', '#viewMoreList .co-btn-bookmark', ( evt ) => {
			evt.preventDefault();
			this.scrap();
		});
	}

  scrap(){
		let _post = Util.get( Config.scrap({
			board: Config.board,
			articleId: this.articleId}), 'POST', {
				'boardAlias': Config.board,
				'targetUrl': this.targetUrl
			});
		_post.then( ( data ) => {
			if( data != -1 ){
				alert( Config.L10N.bookmark_have_done );
			}else{
				alert( Config.L10N.bookmark_already_have_done );
				//Config.apiError( data );
			}

		}, ( data ) => {
			Config.apiError( data );
		});
	}

	isScrap(){

	}

	scrapDelete(){
		let _post = Util.get( Config.scrapDelete({
			board: Config.board,
			articleId: this.articleId}), 'POST', {
				'targetUrl': this.targetUrl
			});
		_post.then( ( data ) => {
			if( data != -1 ){
				this.setChangeUI( data );
			}else{

			}

		}, ( data ) => {
			Config.apiError( data );
		});
	}

	scrapList(){

	}


};

module.exports = Scrap;
