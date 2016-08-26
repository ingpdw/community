import View from './board/View.js';
import Write from './board/Write.js';
import Comment from './board/Comment.js';
import domBySelector from 'dom-by-selector';
import ListFactory from './board/ListFactory';

(function( $, window ){
  'use strict';

  if( !window.ui )
    window.ui = {};

  if( !window.ui.ncCommunity )
    window.ui.ncCommunity = {
      List: ListFactory,
      View: View,
      Write: Write,
      Comment: Comment
    };

  // if( !window.ui.RWDEditor.uploadImageSuccess )
  //   window.ui.RWDEditor.uploadImageSuccess = ( ) => {};

}( window.jQuery, window ));
