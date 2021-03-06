/**
 * Config
 */
import L10N from './Lang';
import Tmpl from 'js-template-string';

//UTC+8 tw
//UTC+9 ko
//UTC+9 ja


let Config = {

	guid: ( window.userData && window.userData.guid )? window.userData.guid: '',

	now: ( window.userData && window.userData.now )? window.userData.now: '',

	nickName: ( window.userData && window.userData.ncAccount
	 	&& window.userData.ncAccount.name )? window.userData.ncAccount.name: '',

	accountStateCase: ( window.userData && window.userData.accountState 
		&& window.userData.accountState.case )? window.userData.accountState.case: '',

	accountStateMsg: ( window.userData && window.userData.accountState
		&& window.userData.accountState.msg )? window.userData.accountState.msg: '',


  //L20N, default: ko
  L10N: L10N[ jQuery('html').attr('lang') || 'ko' ],

  //게시판 종류, default: free
  board: 'free',

	site: '',

  share: {},

  listViewMode: 1,

  isListView: true,

  isCardView: false,

  isInfinite: false,

  isAdmin: false,

  isWrite: true,

	isShare: true,

	isImage: false,

	isMovie: false,

	isShowSignature: true,

	isShowViewUtil: true,

	isListShare: false,

  listSize: 12,

	isShowTitle: true,

	isHideViewInfo: false,

	isApp: false,

	isLike: true,

  loginPage: 'http://op.mlogin.plaync.com/login/signin',

  //GET, 하위 카테고리 목록 조회
  category: ( board ) => `${window._path || '/'}board/${board}/category.json`,

  //GET, 글 목록 + pageing
  list: ( board ) => `${window._path || '/'}board/${board}/article.json`,

  listMore: ( board ) => `${window._path || '/'}board/${board}/article/search/moreArticle`,

  //GET, 글 보기
  view: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}.json`,

  //GET, 댓글 목록 / 내가 좋아요한 댓글 fields=vote
  comment: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/comment.json`,
  commentVote: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/comment.json?fields=vote`,

  //GET, 댓글 목록 더보기  / 내가 좋아요한 댓글 더보기 fields=vote
  commentMore: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/comment/search/moreComment?previousCommentId=${ data.commentId }&size=${ data.size || 12 }&moreDirection=${ data.moreDirection || 'BEFORE' }&fields=${ data.fields || '' }`,
  commentMoreVote: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/comment/search/moreComment?fields=vote&previousCommentId=${ data.commentId }&size=${ data.size || 12 }&moreDirection=${ data.moreDirection || 'BEFORE' }&fields=${ data.fields || '' }`,

  //DELETE, 댓글 삭제
  commentRemove: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/comment/${data.commentId}.json`,

  //POST, 글 신고
  reportArticle: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/reportArticle.json`,

  //POST, 댓글 신고
  reportComment: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/comment/${data.commentId}/reportComment.json`,

  //GET, 글 신고 횟수
  todayReportedCount: ( data ) => `${window._path || '/'}board/_my_/todayReportedCount.json`,

  //DELETE, 댓글 추천 취소 | POST, 댓글 추천
  voteComment: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/comment/${data.commentId}/voteComment.json`,

  //POST, 글 쓰기 | POST, 답글 쓰기
  write: ( board ) => `${window._path || '/'}board/${board}/article.json`,

  //PUT, 글 수정
  update: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}.json`,

  //DELETE, 글 삭제
  delete: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}.json`,

  //POST, 글 좋아요
  vote: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/voteArticle.json`,

  //GET, 이전 다음글 가져오기
  prevNext: ( data ) => `${window._path || '/'}board/${data.board}/article/${data.articleId}/prevNext.json`,

  //GET, 상단 공지 목록
  noticeList: ( data ) => `${window._path || '/'}board/${data.board}/noticeArticle${( data.categoryId )? `?categoryId=${data.categoryId}`: ``}`,

  //GET, 상단 공지 뷰페이지
  noticeView: ( data ) => `${window._path || '/'}board/${data.board}/noticeArticle/${data.articleId}.json`,

  //POST, 스크랩 하기
  scrap: ( data ) => `${window._path || '/'}board/_my_/scrapArticle/${data.articleId}.json`,

  //DELETE, 스크랩 삭제
  scrapDelete: ( data ) => `${window._path || '/'}board/_my_/scrapArticle/${data.articleId}.json`,

  //GET, 스크랩 여부
  isScrap: ( data ) => `${window._path || '/'}board/_my_/isScrapArticle/${data.articleId}.json`,

  //GET, 스크랩 목록
  scrapList: ( data ) => `${window._path || '/'}board/_my_/scrapArticle.json`,

  //GET, 내가 작성한 글 리스트
  myArticle: ( data ) => `${window._path || '/'}board/_my_/article.json`,

  //GET, 내가 작성한 글 카운트
  myArticleCount: ( data ) => `${window._path || '/'}board/_my_/article/search/totalCount.json`,

  //GET, 내가 작성한 댓글 리스트
  myComment: ( data ) => `${window._path || '/'}board/_my_/commentedArticle.json`,

  //GET, 내가 작성한 댓글 카운트
  myCommentCount: ( data ) => `${window._path || '/'}board/_my_/commentedArticle/search/totalCount.json`,

  //리스트 페이지 url
  listPage: 'list',

  //뷰 페이지 url
  viewPage: 'view',

  //글 쓰기 / 글 수정 페이지 url
  writePage: 'write',

  //API에러처리
  apiError: ( data, loginPage ) => {
    if( data.status == '401' || data.exceptionClassName == 'AccessDeniedException' ){
    		alert( L10N[ jQuery('html').attr('lang') || 'ko' ].alert_login );
				window.GNBLogin && window.GNBLogin();
		}

		if( data.status == '400' || data.exceptionClassName == 'AuthorizationException' ){
			//alert( L10N[ jQuery('html').attr('lang') || 'ko' ].alert_login );
		}
		// if( loginPage )
		// 	location.href = loginPage + '?return_url=' + encodeURIComponent( location.href );
    // return;
  }
}

module.exports = Config;
