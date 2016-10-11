/**
 * List
 */

import Config from '../Config';
import Util from '../Util';
import Search from './Search';
import Template from './Template';
import DropdownLayer from '../DropdownLayer';
import ParamInfo from './ParamInfo';
import ListCategory from './ListCategory';
import ListTopUtil from './ListTopUtil';
import NoticeList from './NoticeList';
import Tmpl from 'js-template-string';
import DateFormat from 'date-format-simple';

class EventList{
	constructor( node, options ){
		this.$node = node;
		this._id = this.$node.attr( 'id' );
		this.listId = 'ncCommunityBoardList';

		this.dateFormat = new DateFormat( Config.now, {
		  'a_few_seconds_ago': Config.L10N.a_few_seconds_ago,
		  'seconds_ago': Config.L10N.seconds_ago,
		  'a_minute_ago': Config.L10N.a_minute_ago,
		  'minutes_ago': Config.L10N.minutes_ago,
		  'an_hour_ago': Config.L10N.an_hour_ago,
		  'hours_ago': Config.L10N.hours_ago,
		  'a_day_ago': Config.L10N.a_day_ago,
		  'days_ago': Config.L10N.days_ago,
		  'a_month_ago': Config.L10N.a_month_ago,
		  'months_ago': Config.L10N.months_ago,
		  'a_year_ago': Config.L10N.a_year_ago,
		  'years_ago': Config.L10N.years_ago
		}, true);

		this.isFirstLoaded = false;

		jQuery.extend( true, Config, options );

		Config.board = ( options && options.board )?
			options.board: Config.board;

		Config.isCardView = ( options && options.isCardView )?
			options.isCardView: false;

		Config.isListView = ( options && options.isListView )?
			options.isListView: false;

		Config.site = ( options && options.site )?
			options.site: 'RK';

		Config.naviSize = ( options && options.naviSize )?
			options.naviSize: 5;

		//@TODO only status
		if( Config.board == 'eventlist_running' || options.status == 'RUNNING' )
			Config.status = 'RUNNING';

		//@TODO only status
		if( Config.board == 'eventlist_closed' || options.status == 'CLOSED' )
			Config.status = 'CLOSED';

		//@TODO 망별 구분
		Config.apiUrl = `http://${Util.net( '.' )}promotion.plaync.com/promo/rest/promotions`;

		( options && options.apiUrl )?
			options.apiUrl: Config.apiUrl;
	}

	remove(){
		jQuery( `#${this._id} .${this.listId}` ).empty();
		jQuery( `#${this._id} .pagination-container` ).remove();
	}

	get() {
		let _param = Util.getParams();
		let page = _param.page || 1;

		let list = Util.getJsonp( Config.apiUrl, 'GET', {
			naviSize: Config.naviSize,
			size: Config.listSize,
			game: Config.site,
			status: Config.status,
			page: page
		});

		list.then( ( data ) => {
			let tmp = '';

			//empty listNode
			this.remove();

			//empty data
			if( data.data.length == 0 && !this.isFirstLoaded ){
				this.$node.append( Template.empty( this.listId, Config.L10N.list_none_article ) );
				return;
			}else{
				let page = this.templatePaging( data.paging );
				tmp = this.templateList( data, this.listId );

				//list template + page navigation
				tmp = Tmpl.join( tmp, page );

				//append template data
				this.$node.append( tmp );

				this.isFirstLoaded = true;
			}

		}, () => {})
	}

	templatePaging( _page ){

		let _prev = _page.start - 1;
		let _next = _page.end + 1;
		let _start = _page.start;
		let _end = _page.end;
		let _cur = _page.current;
		let _pageList = [];

		for( let idx = _start, len = _end; len >= idx; idx++ ){
			_pageList.push( idx );
		}

		let tmp = Tmpl.iterate({
			data: _pageList,
			template: ( _v ) => `
				${ (_v == _cur )? `<li class="current">${_v}</li>`: `<li><a href="${Config.listPage}?page=${_v}">${_v}</a></li>` }
			`
		});

		return Tmpl.render({
			data: {page: tmp, prev: _prev, next: _next},
			template: ( _v ) => `
				<div class="pagination-container">
					<ul class="pagination-list">
						${ ( _v.prev )? `<li class="prev"><a href="${Config.listPage}?page=${_v.prev}"><i class="fe-icon-chevron_left"></i></a></li>`: ``}
						${_v.page}
						${ (_v.next <= _end )? `<li class="next"><a href="${Config.listPage}?page=${_v.next}"><i class="fe-icon-chevron_right"></i></a></li>`: ``}
					</ul>
				</div>
			`
		});
	}

	templateList( _data, _id ){
		let _list = Tmpl.iterate({
			data: _data.data,
			template: ( articleList ) => {

				let _displayStart = articleList.displayStartDate,
						_displayEnd = articleList.displayEndDate,
						_start = this.dateFormat.printOnlyDate( articleList.startDate ),
						_end = this.dateFormat.printOnlyDate( articleList.endDate );

				_start = ( _displayStart )? _displayStart: _start;
				_end = ( _displayEnd )? _displayEnd: _end;

				return `
					<li class="board-items" data-articleid="${articleList.promotionId}">
		            <div class="title">
		                <a href="${articleList.url}">${articleList.title}</a>
		            </div>

		            <div class="info" style="text-align:right;">
									<span class="event-date">
										${_start} ~ ${_end}
									</span>
		            </div>
		      </li>`
			}
		});

		return Tmpl.render({
			data: _list,
			template: ( list ) => `<ul class="${_id} board-list-default">${list}</ul>`
		});
	}

};

module.exports = EventList;
