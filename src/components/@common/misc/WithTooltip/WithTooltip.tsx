import * as React from 'react';
import classNames from 'classnames';
import styles from './withTooltip.css';

interface Props {
	className?: string;
	tooltip?: any;
	disabled?: boolean;
}

interface State {
	expanded: boolean;
	expandInverted: boolean;
}

// TODO rewrite with React Hooks
export class WithTooltip extends React.PureComponent<Props, State> {
	private tooltipRef = React.createRef<HTMLParagraphElement>();
	private rootRef = React.createRef<HTMLDivElement>();

	state = {
		expanded: false,
		expandInverted: false,
	};

	render() {
		const {className, tooltip, children} = this.props;
		const {expanded, expandInverted} = this.state;

		return (
			<div
				ref={this.rootRef}
				className={classNames(styles.root, className)}
				onPointerEnter={this.onExpand}
				onPointerLeave={this.onCollapse}>
				{children}
				{expanded && (
					<p ref={this.tooltipRef} className={classNames(styles.tooltip, expandInverted && styles.inverted)}>
						{tooltip}
					</p>
				)}
			</div>
		);
	}

	private onExpand = () => {
		if (this.props.disabled || !this.props.tooltip) {
			return;
		}

		this.setState({expanded: true, expandInverted: false}, this.updateTooltipPosition);
	};

	private onCollapse = () => {
		this.setState({expanded: false, expandInverted: false});
	};

	private updateTooltipPosition = () => {
		// TODO add support of vertical inverse
		const minPadding = 8;
		const viewportWidth = document.documentElement!.clientWidth;
		const tooltipWidth = this.tooltipRef.current!.clientWidth;
		const rootOffsetLeft = this.rootRef.current!.offsetLeft;

		if (viewportWidth - rootOffsetLeft - tooltipWidth < minPadding) {
			// Expand to left if at he right is not enough space
			this.setState({expandInverted: true});
		}
	};
}
