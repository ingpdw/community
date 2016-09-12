import Config from '../Config.js';
import Util from '../Util.js';
import Template from 'js-template-string';
import DateFormat from 'date-format-simple';

let dateFormat = new DateFormat( window.today || new Date, {
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
  'years_ago': Config.L10N.years_ago,
});

module.exports = {
	listTop: () => {
		let _top = Template.render({
			data: '',
			template: ( data ) => `
				<div class="board-top-utils">
					<div class="board-btngroup">
						<button class="co-btn co-btn-search"><i class="fe-icon-search"></i></button>
            ${( Config.isCardView && Config.isListView )? `<button class="co-btn btn-cards"><i class="fe-icon-cards"></i></button>`: ``}
            ${( Config.isCardView && Config.isListView)? `<button class="co-btn btn-list"><i class="fe-icon-list"></i></button>`: ``}
            ${( Config.isWrite )? `<button class="co-btn btn-write"><i class="fe-icon-write"></i></button>`: ``}
					</div>
				</div>`
		});

		return _top;
	},

	noticeList: ( _data ) => {
		return Template.iterate({
			data: _data,
			template: ( data ) => `
				<div class="board-notice-item">
					<span class="category">${data.notice.category.categoryName}</span>
					<a href="${Config.viewPage}?articleId=${data.article.articleId}&isNotice=1">${data.article.title}</a>
				</div>`
		});
	},

	cardList: ( _data, _id ) => {
		let _list = Template.iterate({
			data: _data.articleList,
			template: ( articleList ) => `
				<li class="board-items" data-articleid="${articleList.articleId}" data-is-summary="${( articleList.summary.length > 0 )? true: false}">
				<div class="board-items-wrap">
					<div class="board-items-contents">
						${( articleList.thumbnailUrl )?
						`<div class="thumb">
							<a href="${ articleList.url || `${Config.viewPage}?articleId=${articleList.articleId}` }">
								<img src="${articleList.thumbnailUrl}" alt=""></a>
						</div>`: ''}
						<div class="title">
							<!--span class="category">${articleList.category.categoryName}</span-->
						  <a href="${ articleList.url || `${Config.viewPage}?articleId=${articleList.articleId}` }">${articleList.title}</a>
							${( articleList.hasThumbnail )? `<i class="fe-icon-picture"></i>`: `` }
							<!--i class="fe-icon-new"></i-->
						</div>
						<div class="desc ${( articleList.thumbnailUrl )? '': 'desc-overflow'}">
							<a href="${ articleList.url || `${Config.viewPage}?articleId=${articleList.articleId}` }">
                ${ ( articleList.summary )? articleList.summary.replace( /\n/g, `<br/>`): '' }
              </a>
						</div>
					</div>

					<div class="board-items-footer">
						<div class="info">
							  <span class="writer">${( articleList.writer.adminUser && articleList.writer.emoticonUrl)?
                  `<img src="${articleList.writer.emoticonUrl}" alt=""/>`: articleList.writer.loginUser.name}</span>
								<span class="date">${dateFormat.print( dateFormat.toGMTDate( articleList.updateDate ) )}</span>
						</div>

						<div class="count">
              ${ ( Config.isListShare )? `<button class="co-btn co-btn-share"><i class="fe-icon-share"></i></button>`: ``}
							<span class="count-like" data-count="${( articleList.goodCount >= 0 )? articleList.goodCount: 0}"><i class="fe-icon-like"></i><em>${( articleList.goodCount >= 0 )? articleList.goodCount: 0}</em></span>
							<span class="count-comment" data-count="${articleList.commentCount}"><i class="fe-icon-comment" ></i><em>${articleList.commentCount}</em></span>
						</div>
					</div>
				</div>
				</li>
				`
		});

		return Template.render({
			data: _list,
			template: ( list ) => `<ul class="${_id} board-list-card">${list}</ul>`
		});

	},
	list: ( _data, _id, param = '' ) => {
		let _list = Template.iterate({
			data: _data.articleList,
			template: ( articleList ) => `
			<li class="board-items" data-articleid="${articleList.articleId}">
            <div class="title">
                <!--span class="category">${articleList.category.categoryName}</span-->
                <a href="${Config.viewPage}?articleId=${articleList.articleId}${param}">${articleList.title}</a>
                ${( articleList.hasThumbnail )? `<i class="fe-icon-picture"></i>`: `` }
                <!--i class="fe-icon-new"></i-->
                <div class="count">
                	  ${ ( Config.isListShare )? `<button class="co-btn co-btn-share"><i class="fe-icon-share"></i></button>`: ``}
                    <span class="count-like" data-count="${( articleList.goodCount >= 0 )? articleList.goodCount: 0}"><i class="fe-icon-like"></i><em>${( articleList.goodCount >= 0 )? articleList.goodCount: 0}</em></span>
                    <span class="count-comment" data-count="${articleList.commentCount}"><i class="fe-icon-comment"></i><em>${articleList.commentCount}</em></span>
                </div>
            </div>

            <div class="info">
                <span class="writer">${( articleList.writer.adminUser && articleList.writer.emoticonUrl)?
                  `<img src="${articleList.writer.emoticonUrl}" alt=""/>`: articleList.writer.loginUser.name}</span>
                <span class="date">${dateFormat.print( dateFormat.toGMTDate( articleList.updateDate ) )}</span>
                <span class="hit">${articleList.hitCount}</span>
            </div>
      </li>`
		});

		return Template.render({
			data: _list,
			template: ( list ) => `<ul class="${_id} board-list-default">${list}</ul>`
		});
	},

  listShare: () => {
    return `<div id="ncShare"></div>`;
  },

	prevNext: ( _data ) => {
    let _next = _data.nextArticle || ``;
    let _prev = _data.previousArticle || ``;

		return Template.render({
			data: {_next: _next, _prev, _prev},
			template: ( _v ) => `
			<div class="board-nav">
	      ${ ( _v._prev && _v._prev.articleId ) ?
	        `<p class="prev"><span>${Config.L10N.prev_article}</span><a href="${Config.viewPage}?articleId=${_v._prev.articleId}">${_v._prev.title}</a></p>`: ''}

	      ${ ( _v._next && _v._next.articleId ) ?
	        `<p class="next"><span>${Config.L10N.next_article}</span><a href="${Config.viewPage}?articleId=${_v._next.articleId}">${_v._next.title}</a></p>`: ''}
	    </div>`
		});
  },

	comment: ( _content ) => {
		return `<section class="wrap-comment ncCommentCommonWrap">${_content}</section>`;
	},

	commentHeader: ( _data ) => {
		return Template.render({
			data: _data.pageNavigation,
			template: ( _v ) => `
				<div class="comment-header">
					<h3 class="comment-title">댓글<span>${_v.totalCount}</span></h3>
					<button class="co-btn co-btn-reload"><i class="fe-icon-reload"></i></button>
				</div>
			`
		});
	},

	commentWrite: ( content ) => {
    return `<div class="comment-form">
				<div class="comment-form-textarea">
					<textarea class="content ${content}" name="content" placeholder="${Config.L10N.comment_placeholder_login}" style="height:40px;"></textarea>
					</div>
			</div>`;
  },

	commentRemove: () => {
		return `<div class="comment-article-delete">
					<div class="comment-info"></div>
					<div class="comment-contents">${Config.L10N.comment_list_delete}</div>
					<div class="comment-utils"></div>
				</div>`;
	},

	commentList: ( _data ) => {
		return Template.iterate({
			data: _data.commentList,
			template: ( _v ) => `
				<div class="${( _v.depth == 1 )?
					'comment-article-reply':
					( _v.statusCode == 'DELETE_USER' )? 'comment-article-delete': 'comment-article'}" data-commentid="${_v.commentId}">
					<div class="comment-info">
						<i class="fe-icon-reply"></i>
						<span class="thumb"><img src="http://dn.sfile.plaync.com/data/${_v.writer.loginUser.uid}/profile?type=small" alt=""></span>
						<!--span class="best">BEST</span-->
						<span class="writer">${_v.writer.loginUser.name}</span>
						<span class="date">${dateFormat.print( dateFormat.toGMTDate( _v.updateDate ) )}</span>
						${ (_v.writer.loginUser.uid == Config.guid )? `<button class="co-btn btn-delete" data-commentuser="${_v.writer.loginUser.name}" data-commentid="${_v.commentId}" data-uid="${_v.writer.loginUser.uid}">삭제</button>`: ``}
						${ (_v.writer.loginUser.uid != Config.guid )? `<button class="co-btn btn-declare" data-commentuser="${_v.writer.loginUser.name}" data-commentid="${_v.commentId}" data-uid="${_v.writer.loginUser.uid}">신고</button>`: ``}
					</div>
					<div class="comment-contents">${ ( _v.statusCode == 'DELETE_USER' )? `${Config.L10N.comment_list_delete}`:  _v.contents }</div>
					<div class="comment-utils">
						<button data-commentid="${_v.commentId}" class="co-btn co-btn-like">
							<i class="fe-icon-like"></i>
							<em class="text">${( _v.goodCount >= 0 )? _v.goodCount: 0}</em>
						</button>
						<button class="co-btn co-btn-comments" data-commentid="${_v.commentId}">
							<i class="fe-icon-comments"></i>
							<em class="text">${_v.replyCount}</em>
						</button>
					</div>
				</div>`
		});
	},

	loader: ( id ) => {
		//@TODO Template
		return `<div class="nc-community-loader"><div class="loader-circle"></div></div>`;
	},

  viewSignature: ( _data ) => {
    return Template.render({
      data: _data,
      template: ( _v, _writer = _data.article.writer ) => `
        <div class="view-signature">
  				<div class="thumb"><img src="http://dn.sfile.plaync.com/data/${_writer.loginUser.uid}/profile?type=small" alt=""></div>

  				<div class="writer">${_writer.loginUser.name}</div>

  				<!--div class="info">
  					<span class="jon">${_writer.gameUser.gameCharacterName}</span>
            <span class="servername"></span>
            <span class="level"></span>
            <span class="clan"></span>
  				</div-->
			  </div>`
    });
  },

  view: ( _data, _template, isNotice ) => {
		return Template.render({
			data: _data,
			template: ( _v, _article = _v.article ) => `
				<section class="board-view">
					<div class="view-header">
						<h2 class="view-title">${_article.title}</h2>

						<div class="view-info">
              <span class="writer">${( _article.writer.adminUser && _article.writer.emoticonUrl)?
                `<img src="${_article.writer.emoticonUrl}" alt=""/>`: _article.writer.loginUser.name}</span>
							<span class="date">${dateFormat.print( dateFormat.toGMTDate( _article.updateDate ) )}</span>
							<span class="hit">조회<em>${_article.hitCount}</em></span>
							<span class="comment">댓글<em>${_article.commentCount}</em></span>

              ${( Config.isShowViewUtil )?
							`<div class="ncCommunityMoreButton more">
								<a href="#viewMoreList" class="co-btn co-btn-more"><i class="fe-icon-more"></i></a>
								<ul id="viewMoreList" class="more-list">
									<li class="more-items"><button class="co-btn co-btn-bookmark">${Config.L10N.more_bookmark}</button></li>
									${( Config.isAdmin )? ``: `<li class="more-items"><button class="co-btn co-btn-modify">${Config.L10N.more_modify}</button></li>`}
									${( Config.isAdmin )? ``: `<li class="more-items"><button class="co-btn co-btn-delete">${Config.L10N.more_delete}</button></li>`}
									${( Config.isAdmin )? ``: `<li class="more-items"><button class="co-btn co-btn-report">${Config.L10N.more_report}</button></li>`}
								</ul>
							</div>`: ``}
						</div>
					</div>
					<div class="view-body">
						${ Util.escape( _article.contents )}
					</div>

					<div class="view-utils">
            ${ ( !isNotice )?
						`<button class="co-btn co-btn-like">
							<i class="fe-icon-like"></i>
							<em>${( _article.goodCount >= 0 )? _article.goodCount: 0}</em>
						</button>`: ``}
						${( Config.share && Config.share.msg && nc && nc.uikit && nc.uikit.ShareV2 )? `<div id="ncShare" class="share"></div>` : ''}
					</div>

          ${ ( Config.isAdmin || _article.writer.adminUser && !Config.isShowSignature )? ``: _template.viewSignature( _data ) }
				</section>`
		});
	},

	vote: ( data, goodCount ) => {
		return `<div><span>${Config.L10N.recommend}</span><button id="voteButton">${Config.L10N.recommend}</button>
				<span>${( data && data.voteType == 'FOR' )? `${Config.L10N.recommend}` : ''}</span>
				<span id="goodCount">${( goodCount && goodCount >= 0 )? `${goodCount}`: 0 }</span>
			</div>`;
	},

	scrapInfo: ( scrapCount, templateId ) => {
		return Template.render({
			data: scrapCount,
			template: ( _v ) => `
				<span>스크랩</span><span id="${templateId}">${_v}</span>`
		});
	},

	scrapButton: ( scrapCount, templateId ) => {
		return `<button id=${templateId}>${Config.L10N.more_bookmark} ${scrapCount}</button>`;
	},

	scrapDeleteButton: ( templateId ) => {
		return `<button id=${templateId}>${Config.L10N.more_bookmark} ${Config.L10N.more_delete}</button>`;
	},

	modal: ( _id = 'ncCommunityReportModal' ) => {
		return `<div id="${_id}" class="co-layer-modal"></div>`;
	},

	report: ( _id = 'ncCommunityReport', commentPrefix = '' ) => {
    return `
			<div id="${_id}" class="co-layer nc-community-report">
				<header class="co-layer-header">
					<h1 class="co-layer-title">${Config.L10N.report_title}</h1>
					<button class="co-btn co-btn-close ly-close"><i class="fe-icon-close"></i></button>
				</header>

				<section class="co-layer-contents report-contents">
					<div class="report-remain">
						<h2>
							${Config.L10N.report_remain}
							<span class="wrap-count"><em class="count">16</em>${Config.L10N.report_number}</span>
						</h2>
						<p class="desc">${Config.L10N.report_info}</p>
					</div>

					<div class="report-target">
						<h2>${Config.L10N.report_username}</h2>
						<strong class="target"></strong>
					</div>

					<div class="report-cause">
						<h2>${Config.L10N.report_reason}</h2>
						<ul class="list-cause" id="${commentPrefix}reportCauseList">
							<li>
								<label for="${commentPrefix}reportCase1">${Config.L10N.report_reason1}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase1" checked="checked" value="1"/>
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase2">${Config.L10N.report_reason2}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase2" value="2"/>
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase3">${Config.L10N.report_reason3}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase3" value="3" />
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase4">${Config.L10N.report_reason4}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase4" value="4" />
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase5">${Config.L10N.report_reason5}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase5" value="5" />
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase6">${Config.L10N.report_reason6}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase6" value="6" />
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase7">${Config.L10N.report_reason7}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase7" value="7" />
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase8">${Config.L10N.report_reason8}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase8" value="8" />
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase9">${Config.L10N.report_reason9}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase9" value="9" />
								<i class="fe-icon-checked"></i>
							</li>
							<li>
								<label for="${commentPrefix}reportCase0">${Config.L10N.report_reason0}</label>
								<input type="radio" name="reportCase" id="${commentPrefix}reportCase0" value="0" />
								<i class="fe-icon-checked"></i>
							</li>
						</ul>
					</div>
				</section>

				<footer class="co-btn-wrap report-btn-wrap">
					<button class="reportFinish co-btn co-btn-finish">${Config.L10N.btn_finish}</button>
					<button class="reportCancel co-btn co-btn-cancel ly-close">${Config.L10N.btn_cancel}</button>
				</footer>
			</div>`;
  },

	listMsg: ( data ) => {
		return `<div class="board-list-none"><p>등록된 글이 없습니다.</p></div>`;
		//<p>검색 결과가 없습니다.</p>
		//<p>제재된 계정입니다. 자세한 사항은 고객센터로 문의 바랍니다</p>
		//<p>접근 권한이 없는 페이지 입니다.</p>
		//<p>본인 확인이 필요합니다.</p>
		//<p>진행 중인 이벤트가 없습니다./p&gt;
	},

	empty: ( _id, _list ) => {
		return Template.render({
			data: _list,
			template: ( list ) => `<ul class="${_id} board-list-none">${_list}</ul>` //board-list-event
		});
	}
}
