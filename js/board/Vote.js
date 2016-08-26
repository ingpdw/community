/**
 * VOTE
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class Vote{
	constructor(){
		this.articleId = Util.getParams().articleId;
		this.addEvent();
  }

	addEvent() {
		jQuery( 'body' ).on( 'click', '.board-view .co-btn-like', ( evt ) => {
			evt.preventDefault();
			this.vote();
		});
	}

	setChangeUI( data ) {
		if( data != -1 )
			jQuery( '.board-view .co-btn-like em' ).text( data );
	}

  vote(){
		let _post = Util.get( Config.vote({
			board: Config.board,
			articleId: this.articleId}), 'POST');
		_post.then( ( data ) => {
			if( data != -1 ){
				this.setChangeUI( data );
			}else if( data == -1 ){
				this.voteCancel();
			}
		}, ( data ) => {
			Config.apiError( data );
		});
	}

	voteCancel(){
		let _post = Util.get( Config.vote({
			board: Config.board,
			articleId: this.articleId}), 'DELETE');
		_post.then( ( data ) => {
			if( data != -1 ){
				this.setChangeUI( data );
			}else if( data == -1 ){
				this.vote();
			}
		}, ( data ) => {
			Config.apiError( data );
		});
	}


};

module.exports = Vote;
