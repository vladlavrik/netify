import React, {forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import cn from 'classnames';
import styles from './dropdown.css';

export type DropdownRenderContentFn = (props: {collapse(): void}) => ReactNode;

export interface DropdownRenderTargetProps {
	ref(element: HTMLElement | null): void;
	className: string;
}
export interface DropdownRenderMeta {
	expanded: boolean;
}

export interface DropdownProps {
	className?: string;
	preferExpansionAlign?: 'left' | 'right';
	render(props: DropdownRenderTargetProps, meta: DropdownRenderMeta): ReactNode;
	content: ReactNode | DropdownRenderContentFn;
}

export interface DropdownRef {
	expand(): void;
	collapse(): void;
}

export const Dropdown = forwardRef<DropdownRef, DropdownProps>((props, externalRef) => {
	const {className, render, preferExpansionAlign, content} = props;

	const targetRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	const [expanded, setExpanded] = useState(false);

	const handleExpand = () => {
		popoverRef.current!.showPopover();
	};

	const handleCollapse = useCallback(() => {
		popoverRef.current!.hidePopover();
	}, []);

	useImperativeHandle(
		externalRef,
		() => ({
			expand: handleExpand,
			collapse: handleCollapse,
		}),
		[],
	);

	// Bind popover target to popover content
	useEffect(() => {
		const target = targetRef.current;
		if (!(target instanceof HTMLButtonElement || target instanceof HTMLInputElement)) {
			throw new Error('NativeDropdown required button or input element as target');
		}

		target.popoverTargetElement = popoverRef.current;
	}, []);

	// Enable popover content render on open
	useEffect(() => {
		const popoverNode = popoverRef.current!;
		const handler = (event: ToggleEvent) => {
			setExpanded(event.newState === 'open');
		};
		popoverNode.addEventListener('beforetoggle', handler);

		return () => {
			popoverNode.removeEventListener('beforetoggle', handler);
		};
	}, []);

	return (
		<>
			{render(
				{
					ref(element) {
						targetRef.current = element;
					},
					className: cn(styles.target, expanded && styles.isExpanded, className),
				},
				{expanded},
			)}

			<div
				ref={popoverRef}
				className={cn(styles.popover, preferExpansionAlign === 'left' && styles.preferAlignLeft)}
				{...{popover: 'auto'}}>
				{expanded && (content instanceof Function ? content({collapse: handleCollapse}) : content)}
			</div>
		</>
	);
});

Dropdown.displayName = 'Dropdown';
