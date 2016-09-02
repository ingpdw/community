/**
 * MyArticle
 */

import List from './List';
import Config from '../../Config';

class MyArticle extends List{
	constructor( node, options ){
		super( node, options )
  }

	get(){
		let url = Config.myArticle();
		super.get( url );
	}

	setList( data ){
		console.log( 'MyArticle' );
		console.log( data );
	}

};

module.exports = MyArticle;
