import React, {forwardRef, ReactNode, useCallback, useImperativeHandle, useRef, useState} from 'react';
import cn from 'classnames';
import {Align, useDropdownAutoPosition} from '@/hooks/useDropdownAutoPosition';
import {useGlobalHotkey} from '@/hooks/useGlobalHotkey';
import {useOutsideClickListener} from '@/hooks/useOutsideClickListener';
import styles from './dropdown.css';

export type DropdownRenderContentFn = (props: {collapse(): void}) => ReactNode;

interface DropdownProps {
	className?: string;
	preferExpansionAlignX?: Align;
	preferExpansionAlignY?: Align;
	render(props: {ref(element: HTMLElement | null): void; onClick?(): void}, meta: {expanded: boolean}): ReactNode;
	content: ReactNode | DropdownRenderContentFn;
}

export interface DropdownRef {
	expand(): void;
	collapse(): void;
}

export const Dropdown = forwardRef<DropdownRef, DropdownProps>((props, externalRef) => {
	const {className, render, preferExpansionAlignX, preferExpansionAlignY, content} = props;

	const targetRef = useRef<HTMLElement | null>(null);
	const contentRef = useRef<HTMLParagraphElement>(null);

	const [expanded, setExpanded] = useState(false);

	const [[expandXTo, expandYTo], [contentMaxWidth, contentMaxHeight]] = useDropdownAutoPosition({
		targetRef,
		contentRef,
		checkByY: true,
		checkByX: true,
		preferAlignX: preferExpansionAlignX,
		preferAlignY: preferExpansionAlignY,
		expanded,
	});

	const handleExpandSwitch = () => {
		setExpanded((prevValue) => !prevValue);
	};

	const handleCollapse = useCallback(() => {
		setExpanded(false);
	}, []);

	useOutsideClickListener([targetRef, contentRef], handleCollapse, expanded);
	useGlobalHotkey('Escape', handleCollapse, expanded);

	useImperativeHandle(
		externalRef,
		() => ({
			expand() {
				setExpanded(true);
			},
			collapse() {
				setExpanded(false);
			},
		}),
		[],
	);

	return (
		<div className={cn(styles.root, className)}>
			{render(
				{
					ref(element) {
						targetRef.current = element;
					},
					onClick: handleExpandSwitch,
				},
				{expanded},
			)}

			{expanded && (
				<div
					ref={contentRef}
					className={cn(
						styles.content,
						styles[`expand-x-to-${expandXTo}`],
						styles[`expand-y-to-${expandYTo}`],
					)}
					style={{maxWidth: contentMaxWidth, maxHeight: contentMaxHeight}}>
					{content instanceof Function ? content({collapse: handleCollapse}) : content}
				</div>
			)}
		</div>
	);
});

Dropdown.displayName = 'Dropdown';
