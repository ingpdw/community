/**
 * Delete
 */

import Config from './Config.js';
import Util from './Util.js';

class Loading{
	constructor( $node ){
		this.$node = $node;
		this._id = this.$node.attr( 'id' );
		this.name = 'ncCommunityLoader';
		this._$node = jQuery( `<div class="${this.name} nc-community-loader"><div class="loader-circle"></div></div>` );
  }

	setUI () {
		this.$node.append( this._$node );
	}

	showTop( $node ) {
		this.$node.prepend( this._$node );
		this.show();
	}

	showBottom() {
		this.$node.append( this._$node );
		this.show();
	}

	show() {
		jQuery( `#${this._id} .${this.name}` ).addClass( 'is-show' );
	}

	hide() {
		jQuery( `#${this._id} .${this.name}` ).removeClass( 'is-show' );
	}

	remove() {
		jQuery( `#${this._id} .${this.name}` ).remove();
	}
};

module.exports = Loading;
