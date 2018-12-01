import './LogsItem.js'

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
	:host {
		all: initial;
		display: block;
		height: 100%;
		overflow: auto;
		font-family: inherit;
		font-size: inherit;
	}

	#root {
		min-width: 500px;
	}
</style>
<div id="root">
<!--	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910921" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517912991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517911991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517915991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517916991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910961" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	<logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
	--><logs-item timestamp="1541517910991" method="POST" type="XHR" url="https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G"></logs-item>
</div>

`;


class LogsSection extends HTMLElement {
	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));
	}
}


customElements.define('logs-section', LogsSection);
