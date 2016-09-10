import Editor from './Editor.js';
import Config from './Config.js';
import Util from './Util.js';
import PlainText from './plugin/PlainText.js';
import YoutubePlugin from './plugin/Youtube.js';
import ImagePlugin from './plugin/Image.js';
import YoutubeToolbar from './toolbar/YoutubeToolbar.js';
import UploadImageToolbar from './toolbar/UploadImageToolbar.js';
import RemovePlugin from './plugin/RemovePlugin.js';

import Template from 'js-template-string';

(function( $, window ){
  'use strict';

  class app {
    constructor ( $node, board = 'free', options ) {
      Config.board = board;
      Config.options = options; //{toolbar: [], imageUploadFrameUrl: ''}
      Config.maxImages = ( options && options.maxImages )?
        options.maxImages: Config.maxImages;

      //Editor
      let editor, youtubePlugin, removePlugin, imagePlugin, youtubeToolbar;

      this.editor = editor = new Editor( $node );
      this.editor.onYoutube.add( () => {
        youtubeToolbar.show();
      }, this );
      this.editor.onImage.add( () => {
      }, this );

      //youtube template
      youtubePlugin = new YoutubePlugin();

      //image template
      imagePlugin = new ImagePlugin();

      //remove youtube template and image template.
      removePlugin = new RemovePlugin( Config.$parent, Config.removeButton, Config.removeNode );

      //set Toolbar;
  		youtubeToolbar = new YoutubeToolbar( jQuery( 'body' ), {
  			insert: ( url ) => {
          let tmp = youtubePlugin.template( url );
          editor.insert( tmp );
        }
  		});

      //upload Image
      this.uploadImageToolbar = new UploadImageToolbar();
      this.uploadImageToolbar.onImage.add( ( item ) => {


        if( Config.maxImages <= jQuery( '.fe-image' ).length ){
          alert( Config.L10N.alert_valid_image_maximum );
          return;
        }

        let tmp = imagePlugin.template( item );
        this.insert( tmp );
      });

      ( Config.options && Config.options.fileInfoUrl && Config.options.uploadUrl )?
        this.uploadImageToolbar.getTokenByOption( () => {}):
        this.uploadImageToolbar.getToken( () => {});
    }

    insert( dom ){
      this.editor.insertNode( dom );
    }

    getSubmitContents( txt ) {
      return this.editor.getSubmitContents( txt );
    }

    reset() {
      this.editor.reset();
    }

    getToken() {
      return this.uploadImageToolbar.getTokenString();
    }
  }

  if( !window.ui )
    window.ui = {};

  if( !window.ui.RWDEditor )
    window.ui.RWDEditor = app;

  // if( !window.ui.RWDEditor.uploadImageSuccess )
  //   window.ui.RWDEditor.uploadImageSuccess = ( ) => {};

}( window.jQuery, window ));
