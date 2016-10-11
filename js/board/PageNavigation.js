/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class PageNavigation{
	constructor( paramInfo = {}){
		this.paramInfo = paramInfo;
  }

  setUI( data ) {
    let _page = data || ``;
		let _prev = _page.previousPaginationPage;
		let _next = _page.nextPaginationPage;
		let _end = _page.endPage;
		let _cur = _page.currentPage;

		let tmp = Tmpl.iterate({
			data: _page.pageList,
			template: ( _v ) => `
				${ (_v == _cur )? `<li class="current">${_v}</li>`: `<li><a href="${Config.listPage}?page=${_v}${this.paramInfo.getParamIgnore( 'page' )}">${_v}</a></li>`}
			`
		});

		//@TODO should make L10N - prev, next
		return Tmpl.render({
			data: {page: tmp, prev: _prev, next: _next},
			template: ( _v ) => `
				<div class="pagination-container">
					<ul class="pagination-list">
						${ ( _v.prev )? `<li class="prev"><a href="${Config.listPage}?page=${_v.prev}${this.paramInfo.getParamIgnore( 'page' )}"><i class="fe-icon-chevron_left"></i></a></li>`: ``}
						${_v.page}
						${ ( ( _end != _cur ) && ( _v.next != _cur ) )? `<li class="next"><a href="${Config.listPage}?page=${_v.next}${this.paramInfo.getParamIgnore( 'page' )}"><i class="fe-icon-chevron_right"></i></a></li>`: ``}
					</ul>
				</div>
			`
		});

		//return Template.pageNavigation( data );
	}

};

module.exports = PageNavigation;
