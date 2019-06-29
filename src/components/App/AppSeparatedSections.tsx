import * as React from 'react';
import styles from './appSeparatedSections.css';

interface Props {
	ratio: number;
	minHeight: number;
	topSection: JSX.Element;
	bottomSection: JSX.Element;
	onRatioChange(ratio: number, topEdgeReached: boolean, bottomEdgeReached: boolean): void;
}

export class AppSeparatedSections extends React.PureComponent<Props> {
	render() {
		const {ratio, minHeight, topSection, bottomSection} = this.props;

		return (
			<div className={styles.root}>
				<section
					style={{
						minHeight,
						height: `calc(${ratio}% - 1px)`,
					}}>
					{topSection}
				</section>

				<div className={styles.sectionSeparator} onPointerDown={this.onStartSectionsResize} />

				<section
					style={{
						minHeight,
						height: `calc(${100 - ratio}% + 1px)`,
					}}>
					{bottomSection}
				</section>
			</div>
		);
	}

	private onStartSectionsResize = (event: React.PointerEvent<HTMLDivElement>) => {
		if (event.button & 1) {
			// only left mouse button
			return;
		}

		event.preventDefault();

		const doc = document.documentElement;
		doc.addEventListener('pointermove', this.onUpdateSectionsResize, {passive: true});
		doc.addEventListener('pointerup', this.onStopSectionsResize, {once: true});
	};

	private onStopSectionsResize = () => {
		document.documentElement.removeEventListener('pointermove', this.onUpdateSectionsResize);
	};

	private onUpdateSectionsResize = (event: PointerEvent) => {
		// TODO use throttle and other approves to improve performance
		const {minHeight, onRatioChange} = this.props;
		const docHeight = document.documentElement!.clientHeight;
		const rawRatio = event.pageY / docHeight;

		const separatorPosition = rawRatio * docHeight;
		onRatioChange(
			Math.round(rawRatio * 10000) / 100,
			separatorPosition <= minHeight,
			docHeight - separatorPosition <= minHeight,
		);
	};

	componentWillUnmount() {
		const doc = document.documentElement;
		doc.removeEventListener('pointermove', this.onUpdateSectionsResize);
		doc.removeEventListener('pointerup', this.onStopSectionsResize);
	}
}
