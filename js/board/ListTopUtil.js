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

		this.viewMode =  Util.getParams().viewMode || 'list';

		( this.viewMode == 'list' )?
			this.showCardButton():
			this.showListButton();
  }

	showCardButton(){
		this.$node.find( '.btn-list' ).hide();
		this.$node.find( '.btn-cards' ).show();
	}

	showListButton(){
		this.$node.find( '.btn-list' ).show();
		this.$node.find( '.btn-cards' ).hide();
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
