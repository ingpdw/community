/**
 * MyComment
 */

import List from './List';
import Config from '../../Config';

class MyComment extends List{
	constructor( node, options ){
		super( node, options )
  }

	get(){
		let url = Config.myComment();
		super.get( url );
	}

	setList( data ){
		console.log( 'MyComment' );
		console.log( data );
	}

};

module.exports = MyComment;
