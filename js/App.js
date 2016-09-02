import View from './board/View.js';
import Write from './board/Write.js';
import Comment from './board/Comment.js';

import MyBookmark from './board/my/MyBookmark.js';
import MyComment from './board/my/MyComment.js';
import MyArticle from './board/my/MyArticle.js';

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
      Comment: Comment,
      MyArticle: MyArticle,
      MyComment: MyComment,
      MyBookmark: MyBookmark
    };

  // if( !window.ui.RWDEditor.uploadImageSuccess )
  //   window.ui.RWDEditor.uploadImageSuccess = ( ) => {};

}( window.jQuery, window ));
