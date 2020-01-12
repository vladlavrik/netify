import React, {memo, ReactNode} from 'react';
import styles from './sectionHeader.css';

interface SectionHeaderProps {
	title: string;
	children?: ReactNode;
}

export const SectionHeader = memo<SectionHeaderProps>(function SectionHeader({title, children}) {
	return (
		<div className={styles.root}>
			<h1 className={styles.title}>{title}</h1>
			{children}
		</div>
	);
});
