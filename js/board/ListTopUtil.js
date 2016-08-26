/**
 * List
 */

import Config from '../Config';
import Util from '../Util';
import Search from './Search';
import Template from './Template';
import DropdownLayer from '../DropdownLayer';
import PageNavigation from './PageNavigation';
import Tmpl from 'js-template-string';


class ListTopUtil{
	constructor( node, callback ) {
		this.$node = node;
		this._$node = jQuery( Template.listTop() );
		this.setUI();
		this.addEvent();
		this.callback = callback;

  }

	setUI() {
		this.$node.append( this._$node );
	}

	getNode() {
		return this._$node;
	}

	addEvent() {
		this.$node.on( 'click', '.btn-write', ( evt ) => {
			evt.preventDefault();
			location.href = Config.writePage;
		});

		this.$node.on( 'click', '.btn-cards', ( evt ) => {
			evt.preventDefault();
			this.callback && this.callback( 'card' );

		});

		this.$node.on( 'click', '.btn-list', ( evt ) => {
			evt.preventDefault();
			this.callback && this.callback( 'list' );

		});
	}
};

module.exports = ListTopUtil;
