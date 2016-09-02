/**
 * MyBookmark
 */

import List from './List';
import Config from '../../Config';

class MyBookmark extends List{
	constructor( node, options ){
		super( node, options )
  }

	get(){
		let url = Config.scrapList();
		console.log( url );
		super.get( url );
	}

	setList( data ){
		console.log( 'MyBookmark' );
		console.log( data );
	}
};

module.exports = MyBookmark;
