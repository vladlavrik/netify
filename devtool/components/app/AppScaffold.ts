import '../@common/IconButton'
import './AppSectionHeader'
import BaseUIElement from '../../helpers/BaseUIElement';

type state = {
	showCompose: boolean,
	logsCollapsed: boolean,
}

class AppScaffold extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				display: flex;
				position: relative;
				height: 100vh;
				flex-direction: column;
			}
			.section {
				min-height: 30px;
			}
			.header-control {
				margin: 0 6px;
			}
			.header-control.type-add {
				--icon-button-bg: url('/devtool/styles/icons/add.svg');
			}
			.header-control.type-add.to-close {
				--icon-button-rotate: 45deg;
			}
			.header-control.type-clean {
				--icon-button-bg: url('/devtool/styles/icons/clean.svg');
			}
			.header-control.type-collapse {
				--icon-button-bg: url('/devtool/styles/icons/panel-collapse.svg');
			}
			.header-control.type-collapse.to-expand {
				--icon-button-bg: url('/devtool/styles/icons/panel-expand.svg');
			}
			#sectionSeparator {
				padding: 2px 0;
				cursor: row-resize;
			}
			#sectionSeparator::before {
				display: block;
				content: '';
				height: 3px;
				background: #777;
			}
			#composeSection {
				position: absolute;
				top: 28px;
				left: 0;
				right: 0;
				bottom: 0;
				border-top: #555555 1px solid;
				background: #383838;
				z-index: 1;
			}
			#composeSection::before {
				content: '';
				display: block;
				position: absolute;
				width: 10px;
				height: 6px;
				right: 40px;
				top: -6px;
				clip-path: polygon(0 100%, 50% 0, 100% 100%);
				background: #555555;
			}
			.section-content {
				height: calc(100% - 29px);
			}
		</style>
		<section id="rulesSection" class="section" style="height: 50%;">
			<app-section-header>
				Rules
				<icon-button id="controlCompose" class="header-control type-add" $classif.to-close="showCompose" slot="controls" tooltip="Add rule"></icon-button>
				<icon-button id="controlCleanRules" class="header-control type-clean" slot="controls" tooltip="Clean all rules"></icon-button>
			</app-section-header>
			<div class="section-content">
				<slot name="rules"></slot>
			</div>
		</section>
		<div id="sectionSeparator"></div>
		<section id="logsSection" class="section" style="height: 50%;">
			<app-section-header>
				Logs
				<icon-button id="controlCleanLogs" class="header-control type-clean" slot="controls" tooltip="Clean log"></icon-button>
				<icon-button id="controlToggleLogs" class="header-control type-collapse" $classif.to-expand="logsCollapsed" slot="controls" tooltip="Collapse panel"></icon-button>
			</app-section-header>
			<div class="section-content">
				<slot name="logs"></slot>
			</div>
		</section>
		<section $if="showCompose" id="composeSection">
			<slot name="compose"></slot>
		</section>
	`);

	protected events = [
		{id: 'controlCompose', event: 'click', handler: this.onToggleShowCompose},
		{id: 'controlCleanRules', event: 'click', handler: this.onCleanRules},
		{id: 'controlCleanLogs', event: 'click', handler: this.onCleanLogs},
		{id: 'controlToggleLogs', event: 'click', handler: this.onToggleLogsShow},
		{id: 'sectionSeparator', event: 'pointerdown', handler: this.onStartSectionsResize},
		// TODO cursor on separator move
	];

	//TODO tooltip on shown compose

	constructor(){
		super();
		this.render();
		this.state.showCompose = true;

	}


	public onHideCompose() {
		this.state.showCompose = false;
	}

	public onToggleShowCompose() {
		this.state.showCompose = !this.state.showCompose;
	}

	private onCleanRules() {
		console.log('onCleanRules');
	}

	private onCleanLogs() {
		console.log('onCleanLogs');
	}

	private onToggleLogsShow() {
		if (this.state.logsCollapsed) {
			this.setSectionsRatio(0.5);
		} else {
			this.setSectionsRatio(1);
		}
		this.state.logsCollapsed = !this.state.logsCollapsed;
	}

	private onStartSectionsResize(event: PointerEvent) {
		if (event.button & 1) { // only left mouse button
			return;
		}

		event.preventDefault();
		this.addEventListener('pointermove', this.onUpdateSectionsResize, {passive: true});
		this.addEventListener('pointerup', () => {
			this.removeEventListener('pointermove', this.onUpdateSectionsResize);
		}, {once: true});
	}

	private onUpdateSectionsResize = (event: PointerEvent) => {
		this.setSectionsRatio(event.pageY / document.documentElement!.clientHeight)
	};

	private setSectionsRatio(ratio: number) {
		const firstSection = Math.round(ratio * 10000) / 100;
		const secondSection = 100 - firstSection;

		(this.$.rulesSection as HTMLElement).style.height = firstSection + '%';
		(this.$.logsSection as HTMLElement).style.height = secondSection + '%';
	}
}


customElements.define('app-scaffold', AppScaffold);
