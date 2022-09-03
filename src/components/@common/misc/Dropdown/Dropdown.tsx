import React, {FC, ReactNode, useRef} from 'react';
import cn from 'classnames';
import {Align, useDropdownAutoPosition} from '@/hooks/useDropdownAutoPosition';
import {useOutsideClickListener} from '@/hooks/useOutsideClickListener';
import styles from './dropdown.css';

interface DropdownProps {
	className?: string;
	expanded: boolean;
	target: ReactNode;
	preferExpansionAlignX?: Align;
	preferExpansionAlignY?: Align;
	onCollapse(): void;
	children: ReactNode;
}

export const Dropdown: FC<DropdownProps> = (props) => {
	const {className, expanded, target, preferExpansionAlignX, preferExpansionAlignY, onCollapse, children} = props;

	const targetRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLParagraphElement>(null);

	const [[expandXTo, expandYTo], [contentMaxWidth, contentMaxHeight]] = useDropdownAutoPosition({
		targetRef,
		contentRef,
		checkByY: true,
		checkByX: true,
		preferAlignX: preferExpansionAlignX,
		preferAlignY: preferExpansionAlignY,
		expanded,
	});

	useOutsideClickListener([targetRef, contentRef], onCollapse, expanded);

	return (
		<div ref={targetRef} className={cn(styles.root, className)}>
			{target}

			{expanded && (
				<div
					ref={contentRef}
					className={cn(
						styles.content,
						styles[`expand-x-to-${expandXTo}`],
						styles[`expand-y-to-${expandYTo}`],
					)}
					style={{maxWidth: contentMaxWidth, maxHeight: contentMaxHeight}}>
					{children}
				</div>
			)}
		</div>
	);
};

Dropdown.displayName = 'Dropdown';
