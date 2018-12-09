import {LitElement, html, customElement, property} from '@polymer/lit-element';
import {styleMap} from "lit-html/directives/style-map";
import '../@common/IconButton';
import '../compose/ComposeRoot';
import './AppSectionHeader';

export interface resizeEvent {
	edgesReached: {
		top: boolean;
		bottom: boolean;
	};
}

declare global {
	interface HTMLElementTagNameMap {
		'app-separated-sections': AppSeparatedSections;
	}
}

/*
 * TODO
 * on resize - recalculate
 */

@customElement('app-separated-sections' as any)
export class AppSeparatedSections extends LitElement {
	private sectionsRatio = 50;

	@property({type: Number})
	minHeight: number = 0;

	protected render() {
		return html`
		<style>
			:host {
				display: flex;
				position: relative;
				height: 100vh;
				flex-direction: column;
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
		</style>

		<section
			style="${styleMap({
				minHeight: `${this.minHeight}px`,
				height: `calc(${this.sectionsRatio}% - 1px)`
			})}">
			<slot name="top-section"></slot>
		</section>

		<div id="sectionSeparator" @pointerdown="${this.onStartSectionsResize}"></div>

		<section
			style="${styleMap({
				minHeight: `${this.minHeight}px`,
				height: `calc(${100 - this.sectionsRatio}% + 1px)`
			})}">
			<slot name="bottom-section"></slot>
		</section>
		`;
	}


	public setRatio(ratio: number) {
		const oldRatioValue = this.sectionsRatio;
		this.sectionsRatio = ratio;
		this.requestUpdate('sectionsRatio', oldRatioValue);
	}

	private onStartSectionsResize = (event: PointerEvent) => {
		if (event.button & 1) { // only left mouse button
			return;
		}

		event.preventDefault();

		const doc = document.documentElement;
		doc.addEventListener('pointermove', this.onUpdateSectionsResize, {passive: true});
		doc.addEventListener('pointerup', () => {
			doc.removeEventListener('pointermove', this.onUpdateSectionsResize);
		}, {once: true});
	};

	private onUpdateSectionsResize = (event: PointerEvent) => {
		//TODO wait previous render and throttle
		const oldRatioValue = this.sectionsRatio;
		const docHeight = document.documentElement!.clientHeight;
		const ratio = event.pageY / docHeight;
		this.sectionsRatio = Math.round(ratio * 10000) / 100;
		this.requestUpdate('sectionsRatio', oldRatioValue);

		const separatorPosition = ratio * docHeight;

		this.dispatchEvent(new CustomEvent<resizeEvent>('separatedSectionResize', {
			bubbles: true,
			detail: {
				edgesReached: {
					top: separatorPosition <= this.minHeight,
					bottom: docHeight - separatorPosition <= this.minHeight,
				}
			},
		}));
	};
}
