import React, {memo, ReactNode} from 'react';
import styles from './sectionHeader.css';

interface SectionHeaderProps {
	title: string;
	children?: ReactNode;
}

export const SectionHeader = memo<SectionHeaderProps>(({title, children}) => (
	<div className={styles.root}>
		<p className={styles.title}>{title}</p>
		{children}
	</div>
));

SectionHeader.displayName = 'SectionHeader';
