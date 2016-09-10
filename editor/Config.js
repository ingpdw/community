/**
 * Config
 */
import L10N from './editorLang.js';
import UploadImageCallback from './UploadImageCallback.js';
import Template from 'js-template-string';

const $parent = jQuery( '#froala-editor' );
const froalaKey = 'EKF1KXDA1INBc1KPc1TK==';
const removeButton = 'fe-btn fe-remove-button';
const removeButtonTemplate = `<button class="${removeButton}"><i class="fe-icon-close_circle_o"><span hidden>remove</span></i></button>`;
const removeButtonReg =  /\<button class=\"fe-btn fe-remove-button\"\>.+\<\/button\>/g;

module.exports = {
	//loginPage: '',

	guid: ( window.userData && window.userData.guid )? window.userData.guid: '',

	now: ( window.userData && window.userData.now )? window.userData.now: '',

	nickName: ( window.userData && window.userData.nickName )? window.userData.nickName: '',

	options: {}, //{toolbar: [], imageUploadFrameUrl: '', fileInfoUrl: '', uploadUrl: '', channel}

	maxImages: 10,

	loginPage: 'http://op.mlogin.plaync.com/login/signin',

	froalaKey: froalaKey,

	L10N: L10N[ jQuery('html').attr('lang') || 'ko' ],

	createToken: ( data ) => `/board/${data.board}/upload/token.json`,

	getTokenFileInfo: ( data ) => `/board/${data.board}/upload/token/${data.tokenId}/file.json`,
	// createToken: ( data ) => `/file/createToken.json`,
	// getTokenFileInfo: ( data ) => `/file/tokenFileInfo.json?tokenId=${data.tokenId}`,
	pasteDeniedTags: [
		'a', 'table', 'tr', 'td', 'tbody', 'ol', 'ul', 'li', 'pre',
		'dt', 'dd', 'dl', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'strong', 'img',
		'form', 'fieldset', 'hr', 'legend', 'select', 'input', 'button', 'option', 'optgroup', 'span', 'textarea', 'em',
		'b', 'i', 'font'
	],
	isUpdatePage: !!jQuery( 'form[action=update]' ).length,
	$parent: $parent,
	removeButton: removeButton,
	removeButtonTemplate: removeButtonTemplate,
	removeButtonReg: removeButtonReg,
	appendYoutubeTemplate: ( id ) => {
		return Template.render({
			data: id,
			template: ( id ) => `
			<div class="fe-video" data-contents-type="video"
				data-contents-json="{&quot;vendor&quot;:&quot;youtube&quot;,&quot;video_id&quot;:&quot;${id}&quot;}" contenteditable="false">
				<div class="fe-video-inner"><iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>${removeButtonTemplate}</div>
			</div><div></div>`
		});
	},

	appendImageTemplate: ( _data ) => {
		return Template.render({
			data: {
				url: _data.fileUrl || _data.downloadurl || '',
				width: _data.width || '0',
				height: _data.height || '0'
			},
			template: ( data ) => `
			<div data-contents-type="image"
				data-contents-json="{&quot;src&quot;:&quot;${ data.url }&quot;,
					&quot;width&quot;:${data.width || 0},
					&quot;height&quot;:${data.height || 0}}" contenteditable="false" class="fr-deletable">
				<div class="fe-image-inner"><img src="${data.url}" class="fe-image" alt=""> ${removeButtonTemplate} </div>
			</div><div></div>`
		});
	},

	toolbarYoutubeLayer: () => {
		return Template.render({
			data: `append youtube`,
			template: ( name ) => `
			<div style="margin:10px;">
				<input id="rwdEditor_youtube_url" type="text" />
				<button id="rwdEditor_youtube_button" type="button">${name}</button>
			</div>`
		});
	},
	imageUploadFrameId: 'ncRWDEditorUploadFrame',
	imageUploadFrame: ( frameSrc = '/html/upload.html' ) => {
		return Template.render({
			data: frameSrc,
			template: ( frameSrc ) => `
			<i class="fe-icon-photo"></i>
			<iframe id="ncRWDEditorUploadFrame" src="${frameSrc}" class="fe-toolbar-iframe" frameborder="0" scrolling="no">
			</iframe>`
		});
	},
  //API에러처리
  apiError: ( data, loginPage ) => {

    if( data.status == '401' || data.exceptionClassName == 'AccessDeniedException' ){
      //@TODO L10N msg
      alert( L10N[ jQuery('html').attr('lang') || 'ko' ].alert_login );
			if( loginPage )
				location.href = loginPage + '?return_url=' + encodeURIComponent( location.href );
      return;
    }

    if( data.status == '400' ){}
  }
}
