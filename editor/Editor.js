/**
 * Editor
 */

import Config from './Config.js';
import Submit from './Submit.js';
import Template from 'js-template-string';
import Observer from 'js-observer';

class Editor{
	constructor( node ){
		this.$node = node;
		this.state = ''; //pluginInsert
		this.onYoutube = new Observer;
		this.onImage = new Observer;

		let fr = jQuery.FroalaEditor;
		let This = this;

		let imageUploadFrameUrl = ( Config.options && Config.options.imageUploadFrameUrl )?
			Config.options.imageUploadFrameUrl: '/html/upload.html';

		fr.DefineIconTemplate('fe-icons', '<i class="fe-icon-[NAME]"></i>');
		fr.DefineIconTemplate('insertImage', Config.imageUploadFrame( imageUploadFrameUrl ) );

		fr.DefineIcon('insertImage', {template: 'insertImage'});
	    fr.RegisterCommand('insertImage', {
	      title: 'Insert image',
	      focus: true,
	      undo: true,
	      refreshAfterCallback: false,
	      callback: () => {
					this.saveCursor();
					this.onImage.emit();
	      }
	    });

		fr.DefineIcon('youtube', {template: 'fe-icons'}); // insert Youtube
	    fr.RegisterCommand('insertYoutube', {
	      title: 'Insert youtube',
	      focus: true,
	      undo: true,
	      refreshAfterCallback: false,
	      icon: 'youtube',
	      callback: () => {
					this.saveCursor();
					this.onYoutube.emit();
	      }
	    });

		let buttons = ['insertYoutube', 'insertImage'];

		if( Config.options && Config.options.toolbar )
			buttons = buttons.concat( Config.options.toolbar );

		this.$node.froalaEditor({
			'key': Config.froalaKey,
			'enter': jQuery.FroalaEditor.ENTER_DIV,
			'pasteDeniedTags': Config.pasteDeniedTags,
			'placeholderText': Config.L10N.alert_valid_contents,
      'plainPaste': true,
      'imagePaste': false,
			'disableRightClick': true,
			'charCounterCount': false,
			// 'dragInline': false,
			// 'pluginsEnabled': ['draggable'],
			'toolbarButtons': buttons, //≥ 1200px
			'toolbarButtonsMD': buttons, //≥ 992px
			'toolbarButtonsSM': buttons, //≥ 768px
			'toolbarButtonsXS': buttons //< 768px

    });

		this.submit = new Submit();
	}

	getSubmitContents() {
		return this.submit.beforeSubmit( this.getCode() );
	}

	cursorDel() {
		this.$node.froalaEditor( 'cursor.del' );
	}

	setState( state ) {
		this.state = state;
	}

	restore() {
		this.$node.froalaEditor( 'selection.restore' );
	}

	saveCursor() {
		this.$node.froalaEditor( 'selection.save' );
	}

	insert( dom ) {
		this.restore();
		this.$node.froalaEditor( 'html.insert', dom, false );
		this.state = 'pluginInsert';
	}

	insertNode( dom ) {
		this.restore();
		this.$node.froalaEditor( 'html.insert', dom, false );
		this.state = 'userInsert';
	}

	reset() {
		this.$node.froalaEditor('html.set', '<div></div>' );
	}

	get(){
		return this.$node;
	}

	enter() {
		this.$node.froalaEditor( 'cursor.enter', true );
	}

	focus() {
		this.$node.froalaEditor( 'events.focus' );
	}

	setFocusAtEnd( node ) {
		this.$node.froalaEditor( 'selection.setAtEnd', node );
	}

	setEndElement( node ) {
		this.$node.froalaEditor( 'selection.endElement' );
	}

	getCode() {
		return this.$node.froalaEditor( 'html.get' );
	}
	//@Test
	scrollDown(){
		jQuery( '#froala-editor .fr-wrapper' ).scrollTop( jQuery( '#froala-editor .fr-view' ).height() );
	}
};

module.exports = Editor;
