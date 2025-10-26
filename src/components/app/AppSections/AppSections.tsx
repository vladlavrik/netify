import React, {ReactNode, useCallback, useEffect, useState} from 'react';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';
import {useAppLayoutMode} from '@/hooks/useAppLayoutMode';
import styles from './appSections.css';

interface AppSectionsProps {
	mainSection: ReactNode;
	secondarySection: ReactNode;
	floatingSection?: ReactNode;
}

export const AppSections = observer<AppSectionsProps>((props) => {
	const {mainSection, secondarySection, floatingSection} = props;

	const layout = useAppLayoutMode();

	const getDefaultSecondarySectionSize = () => {
		return layout === 'horizontal' ? window.innerWidth / 2 : window.innerHeight / 2;
	};
	const [secondarySectionSize, setSecondarySectionSize] = useState(getDefaultSecondarySectionSize);

	const handleStartSectionsResize = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (event.button & 1) {
				// Only left mouse button
				return;
			}

			event.preventDefault();

			const doc = document.documentElement;
			doc.addEventListener('pointermove', handleUpdateSectionsResize, {passive: true});
			doc.addEventListener('pointerup', handleStopSectionsResize, {once: true});
		},
		[layout],
	);

	const handleStopSectionsResize = useCallback(() => {
		const doc = document.documentElement;
		doc.removeEventListener('pointermove', handleUpdateSectionsResize);
		doc.removeEventListener('pointerup', handleStopSectionsResize);
	}, [layout]);

	const handleUpdateSectionsResize = useCallback(
		(event: PointerEvent) => {
			setSecondarySectionSize(
				layout === 'horizontal' ? window.innerWidth - event.pageX : window.innerHeight - event.pageY,
			);
		},
		[layout],
	);

	// Update size on layout change
	useEffect(() => {
		setSecondarySectionSize(getDefaultSecondarySectionSize);

		// Workaround to Chrome bug: sometimes viewport size is 0x0 on initialization
		if (window.innerHeight === 0 || window.innerWidth === 0) {
			setTimeout(() => {
				setSecondarySectionSize(getDefaultSecondarySectionSize);
			}, 100);
		}
	}, [layout]);

	// Unset event on unmount
	useEffect(() => {
		return handleStopSectionsResize;
	}, []);

	return (
		<div
			className={cn(
				styles.root,
				layout === 'horizontal' && styles.isHorizontalLayout,
				layout === 'vertical' && styles.isVerticalLayout,
			)}>
			<section className={cn(styles.section, styles.main)}>{mainSection}</section>

			<div className={styles.separator} onPointerDown={handleStartSectionsResize} />

			<section
				className={cn(styles.section, styles.secondary)}
				style={{[layout === 'horizontal' ? 'width' : 'height']: secondarySectionSize}}>
				{secondarySection}
				{floatingSection && <div className={styles.floatingSection}>{floatingSection}</div>}
			</section>
		</div>
	);
});
AppSections.displayName = 'AppSections';
