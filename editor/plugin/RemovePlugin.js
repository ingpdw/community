/**
 * RemovePlugin - singleton
 */

import convertSelector from 'convert-selector';

let instance = null;

class RemovePlugin{
	constructor( $parent, removeButton, removeNode ){

		if( !instance ){
			this.$parent = $parent;
			this.removeButton = removeButton;
			this.removeNode = removeNode;
			this.addEvent();
			instance = this;
		}

		return instance;
	}

	addEvent(){
		jQuery( 'body' ).on( 'click', convertSelector( this.removeButton ), ( evt ) => {
			evt.preventDefault();
			let _target = jQuery( evt.currentTarget ).parent().parent();
			_target.remove();
		});
	}
};

module.exports = RemovePlugin;
