import React, {memo, useState, useCallback, useEffect, ReactNode} from 'react';
import {useStore} from 'effector-react';
import cn from 'classnames';
import {$secondarySectionCollapsed} from '@/stores/uiStore';
import {useCompactModeCondition} from '@/hooks/useCompactModeCondition';
import styles from './appSections.css';

interface AppSectionsProps {
	mainSection: ReactNode;
	secondarySection: ReactNode;
	floatingSection?: ReactNode;
}

export const AppSections = memo<AppSectionsProps>(function AppSections(props) {
	const {mainSection, secondarySection, floatingSection} = props;

	const [secondarySectionWidth, setSecondarySectionWidth] = useState(() => window.innerWidth / 2);

	const isCompactsMode = useCompactModeCondition();
	const showSecondarySection = !useStore($secondarySectionCollapsed) && !isCompactsMode;

	/* eslint-disable @typescript-eslint/no-use-before-define */
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
		setSecondarySectionWidth(window.innerWidth - event.pageX);
	}, []);
	/* eslint-enable @typescript-eslint/no-use-before-define */

	useEffect(() => handleStopSectionsResize, []);

	return (
		<div className={styles.root}>
			<section className={cn(styles.section, styles.main)}>{mainSection}</section>

			{showSecondarySection && <div className={styles.separator} onPointerDown={handleStartSectionsResize} />}

			{showSecondarySection && (
				<section className={cn(styles.section, styles.secondary)} style={{width: secondarySectionWidth}}>
					{showSecondarySection && secondarySection}
				</section>
			)}

			{floatingSection && (
				<section
					className={cn(styles.floatingSection, !showSecondarySection && styles.overlay)}
					style={{width: secondarySectionWidth}}>
					{floatingSection}
				</section>
			)}
		</div>
	);
});
