import React, {memo, useState, useRef, useCallback, ReactNode} from 'react';
import classNames from 'classnames';
import {useDropdownAutoPosition} from '@/hooks/useDropdownAutoPosition';
import styles from './withTooltip.css';

interface WithTooltipProps {
	className?: string;
	tooltip?: any;
	disabled?: boolean;
	children: ReactNode;
}

export const WithTooltip = memo<WithTooltipProps>(props => {
	const {className, tooltip, disabled, children} = props;

	const [expanded, setExpanded] = useState(false);

	const targetRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLParagraphElement>(null);

	const handleExpand = useCallback(() => {
		if (!disabled && tooltip) {
			setExpanded(true);
		}
	}, [disabled, !!tooltip]);

	const handleCollapse = useCallback(() => setExpanded(false), []);

	const [[expandXTo, expandYTo], [contentMaxWidth, contentMaxHeight]] = useDropdownAutoPosition({
		targetRef,
		contentRef,
		checkByY: true,
		checkByX: true,
		expanded,
	});

	return (
		<div
			ref={targetRef}
			className={classNames(styles.root, className)}
			onPointerEnter={handleExpand}
			onPointerLeave={handleCollapse}>
			{children}
			{expanded && (
				<p
					ref={contentRef}
					className={classNames(
						styles.tooltip,
						styles[`expand-x-to-${expandXTo}`],
						styles[`expand-y-to-${expandYTo}`],
					)}
					style={{maxWidth: contentMaxWidth, maxHeight: contentMaxHeight}}>
					{tooltip}
				</p>
			)}
		</div>
	);
});

WithTooltip.displayName = 'WithTooltip';
