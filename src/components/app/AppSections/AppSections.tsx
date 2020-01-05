import React, {memo, useState, useRef, useCallback, useEffect, ReactNode} from 'react';
import {useStore} from 'effector-react';
import {$secondarySectionCollapsed} from '@/stores/uiStore';
import styles from './appSections.css';

interface AppSectionsProps {
	mainSection: ReactNode;
	secondarySection: ReactNode;
}

export const AppSections = memo<AppSectionsProps>(props => {
	const {mainSection, secondarySection} = props;

	const secondarySectionCollapsed = useStore($secondarySectionCollapsed);
	const [sectionsRatio, setSectionsRatio] = useState(50);

	const finalSectionRatio = secondarySectionCollapsed ? 100 : sectionsRatio;

	const isRatioMoving = useRef(false);

	// TODO fix callback dependencies
	const handleStartSectionsResize = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
		if (event.button & 1) {
			// Only left mouse button
			return;
		}

		event.preventDefault();

		const doc = document.documentElement;
		doc.addEventListener('pointermove', handleUpdateSectionsResize, {passive: true});
		doc.addEventListener('pointerup', handleStopSectionsResize, {once: true});
	}, []);

	const handleStopSectionsResize = useCallback(() => {
		const doc = document.documentElement;
		doc.removeEventListener('pointermove', handleUpdateSectionsResize);
		doc.removeEventListener('pointerup', handleStopSectionsResize);
	}, []);

	const handleUpdateSectionsResize = useCallback((event: PointerEvent) => {
		const docHeight = document.documentElement!.clientHeight;
		const rawRatio = event.pageY / docHeight;

		setSectionsRatio(Math.round(rawRatio * 10000) / 100);
	}, []);

	useEffect(() => {
		if (isRatioMoving.current) {
			return handleStopSectionsResize;
		}
		return undefined;
	}, []);

	return (
		<div className={styles.root}>
			<section
				className={styles.section}
				style={{
					height: `calc(${finalSectionRatio}% - 1px)`,
				}}>
				{mainSection}
			</section>

			<div className={styles.separator} onPointerDown={handleStartSectionsResize} />

			<section
				className={styles.section}
				style={{
					height: `calc(${100 - finalSectionRatio}% + 1px)`,
				}}>
				{secondarySection}
			</section>
		</div>
	);
});

AppSections.displayName = 'AppSections';
