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
import Observer from 'js-observer';

class ListTopUtil{
	constructor( node ) {
		this.$node = node;
		this._$node = jQuery( Template.listTop() );
		this.setUI();
		this.addEvent();

		this.onViewMode = new Observer;
		this.onWrite = new Observer;

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
			this.onWrite.emit();
		});

		this.$node.on( 'click', '.btn-cards', ( evt ) => {
			evt.preventDefault();
			this.onViewMode.emit( 'card' );
		});

		this.$node.on( 'click', '.btn-list', ( evt ) => {
			evt.preventDefault();
			this.onViewMode.emit( 'list' );
		});
	}
};

module.exports = ListTopUtil;
