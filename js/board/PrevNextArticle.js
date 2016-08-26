/**
 * PrevNextArticle
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class PrevNextArticle{
	constructor( callback ) {

  }

	get( articleId, callback ){
		let prevNext = Util.get( Config.prevNext({
			board: Config.board,
			articleId: articleId
		}), 'GET');

		prevNext.then( ( data ) => {
			if( data && data.previousArticle ){
				callback && callback( data.previousArticle.articleId );
				return;
			}
			callback && callback( 0 );
		}, ( data ) => {
			callback && callback( 0 );
		});
	}

  // setUI( data ) {
	// 	return Template.prevNext( data );
	// }
};

module.exports = PrevNextArticle;
