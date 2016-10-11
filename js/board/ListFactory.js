/**
 * ListFactory
 */
import List from './List';
import ListInfinite from './ListInfinite';
import EventList from './EventList';

class ListFactory{
	constructor( node, options ){

		if( options.board == 'eventlist_closed' || options.board == 'eventlist_running' ){
			return new EventList( node, options );
		}

		return ( options && options.isInfinite )?
			new ListInfinite( node, options ):
			new List( node, options );
  }
};

module.exports = ListFactory;
