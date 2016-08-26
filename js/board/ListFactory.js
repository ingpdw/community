/**
 * ListFactory
 */
import List from './List';
import ListInfinite from './ListInfinite';

class ListFactory{
	constructor( node, options ){
		return ( options && options.isInfinite )?
			new ListInfinite( node, options ):
			new List( node, options );
  }
};

module.exports = ListFactory;
