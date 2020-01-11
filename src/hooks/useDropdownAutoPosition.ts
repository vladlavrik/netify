import {useState, useLayoutEffect, RefObject, useMemo} from 'react';

export type Align = 'start' | 'end';

type ExpansionRule = [
	// Align to
	[Align, Align],

	// Max height of content (available space in px to the edge minus minimal padding space)
	[number | undefined, number | undefined],
];

// Minimal space to the edge of the viewport from the content block
const minSideSpace = 8;

/**
 * Detect expansion align and maximum allowed size of the content block
 * @param targetStartOffset
 * @param targetEndOffset
 * @param targetSize
 * @param contentStartOffset
 * @param contentEndOffset
 * @param preferAlignTo
 * @param alignFrom - if 'end', then the content is located after the target (applicable for vertical),
 *   if 'start', then content is located from the same axis offset point as the target (applicable for horizontal),
 */
function detectNewAxisRule(
	targetStartOffset: number,
	targetEndOffset: number,
	targetSize: number,
	contentStartOffset: number,
	contentEndOffset: number,
	preferAlignTo: Align,
	alignFrom: Align,
) {
	const isFit =
		(preferAlignTo === 'start' && contentStartOffset >= minSideSpace) ||
		(preferAlignTo === 'end' && contentEndOffset >= minSideSpace);

	// If the content is in fit with prefer expansion direction - return
	if (isFit) {
		return;
	}

	let alignTo: Align;
	let sizeLimit: number | undefined;

	// Determine the direction in which more space
	if (targetStartOffset > targetEndOffset) {
		alignTo = 'start';
		sizeLimit = targetStartOffset - minSideSpace;
	} else {
		alignTo = 'end';
		sizeLimit = targetEndOffset - minSideSpace;
	}

	// Correct maximum allowed size
	if (alignFrom === 'start') {
		sizeLimit += targetSize;
	}

	return {alignTo, sizeLimit};
}

interface UseDropdownAutoPositionOptions {
	targetRef: RefObject<HTMLElement>;
	contentRef: RefObject<HTMLElement>;
	expanded: boolean;

	/** @default 'end'*/
	preferAlignX?: Align;

	/** @default 'end'*/
	preferAlignY?: Align;

	/** @default false */
	checkByX?: boolean;

	/** @default false */
	checkByY?: boolean;
}

export function useDropdownAutoPosition(options: UseDropdownAutoPositionOptions) {
	const {targetRef, contentRef, expanded} = options;
	const {preferAlignX = 'end', preferAlignY = 'end', checkByX, checkByY} = options;

	const defaultRule = useMemo<ExpansionRule>(
		() => [
			[preferAlignX, preferAlignY],
			[undefined, undefined],
		],
		[preferAlignX, preferAlignY],
	);

	const [expansionRule, setExpansionRule] = useState(defaultRule);

	useLayoutEffect(() => {
		if (!expanded || (!checkByX && !checkByY)) {
			return;
		}

		const targetRect = targetRef.current!.getBoundingClientRect();
		const contentRect = contentRef.current!.getBoundingClientRect();

		let newXRule;
		let newYRule;
		if (checkByX) {
			newXRule = detectNewAxisRule(
				targetRect.left,
				window.innerWidth - targetRect.right,
				targetRect.width,
				contentRect.left,
				window.innerWidth - contentRect.right,
				preferAlignX,
				'start',
			);
		}

		if (checkByY) {
			newYRule = detectNewAxisRule(
				targetRect.top,
				window.innerHeight - targetRect.bottom,
				targetRect.height,
				contentRect.top,
				window.innerHeight - contentRect.bottom,
				preferAlignY,
				'end',
			);
		}

		// Avoid an extra rendering
		if (!newXRule && !newYRule) {
			return;
		}

		setExpansionRule([
			[newXRule?.alignTo || preferAlignX, newYRule?.alignTo || preferAlignY],
			[newXRule?.sizeLimit, newYRule?.sizeLimit],
		]);

		return () => {
			// Reset to the default after collapse
			setExpansionRule(defaultRule);
		};
	}, [expanded]);

	return expansionRule;
}
