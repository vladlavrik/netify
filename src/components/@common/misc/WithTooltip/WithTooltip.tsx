import React, {FC, ReactNode, useCallback, useEffect, useMemo, useRef} from 'react';
import cn from 'classnames';
import {pseudoRandomHex} from '@/helpers/random';
import styles from './withTooltip.css';

const showTimeout = 600;

export interface WithTooltipRenderTargetProps {
	id: string;
	className?: string;
	'aria-labelledby': string;
	onMouseEnter?(): void;
	onMouseLeave?(): void;
}

interface WithTooltipProps {
	className?: string;
	id?: string;
	tagName?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'strong' | 'em' | 'i' | 'b' | 'label';
	tooltip?: ReactNode;
	tooltipStyled?: boolean;
	disabled?: boolean;
	render?(props: WithTooltipRenderTargetProps): ReactNode;
	children?: ReactNode;
}

export const WithTooltip: FC<WithTooltipProps> = (props) => {
	const {
		id: propId,
		className,
		tagName: TagName = 'div',
		tooltip,
		tooltipStyled = true,
		disabled,
		render,
		children,
	} = props;

	const id = useMemo(() => {
		return propId || `id-with-tooltip-${pseudoRandomHex(8)}`;
	}, [propId]);

	const tooltipId = `${id}-tooltip`;

	const tooltipRef = useRef<HTMLParagraphElement | HTMLDivElement | null>(null);
	const showTimeoutId = useRef(0);

	const handleExpand = useCallback(() => {
		showTimeoutId.current = window.setTimeout(() => {
			showTimeoutId.current = 0;
			tooltipRef.current?.showPopover();
		}, showTimeout);
	}, []);

	const handleCollapse = useCallback(() => {
		if (showTimeoutId.current) {
			clearTimeout(showTimeoutId.current);
		}
		tooltipRef.current?.hidePopover();
	}, []);

	// Hide popover on become disabled
	useEffect(() => {
		if (disabled && showTimeoutId.current) {
			clearTimeout(showTimeoutId.current);
		}
		if (disabled && tooltipRef.current?.matches(':popover-open')) {
			clearTimeout(showTimeoutId.current);
		}
	}, [disabled]);

	// Unset timeout on unmount
	useEffect(() => {
		return () => {
			if (showTimeoutId.current) {
				clearTimeout(showTimeoutId.current);
			}
		};
	}, []);

	return (
		<>
			{tooltip && !disabled && (
				<>
					{tooltipStyled ? (
						<p
							ref={tooltipRef}
							className={cn(styles.tooltip, styles.isStyled)}
							id={tooltipId}
							{...{popover: 'manual'}}>
							{tooltip}
						</p>
					) : (
						<div ref={tooltipRef} className={styles.tooltip} id={tooltipId} {...{popover: 'manual'}}>
							{tooltip}
						</div>
					)}
				</>
			)}

			{render ? (
				render({
					id,
					className: cn(styles.target, className),
					'aria-labelledby': tooltipId,
					onMouseEnter: disabled ? undefined : handleExpand,
					onMouseLeave: disabled ? undefined : handleCollapse,
				})
			) : (
				<TagName
					className={cn(styles.target, className)}
					id={id}
					aria-labelledby={tooltipId}
					onMouseEnter={disabled ? undefined : handleExpand}
					onMouseLeave={disabled ? undefined : handleCollapse}>
					{children}
				</TagName>
			)}
		</>
	);
};

WithTooltip.displayName = 'WithTooltip';
