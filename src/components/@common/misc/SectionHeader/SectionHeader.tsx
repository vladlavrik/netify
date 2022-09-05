import React, {FC, ReactNode} from 'react';
import styles from './sectionHeader.css';

interface SectionHeaderProps {
	title: ReactNode;
	children?: ReactNode;
}

export const SectionHeader: FC<SectionHeaderProps> = ({title, children}) => {
	return (
		<div className={styles.root}>
			<h1 className={styles.title}>{title}</h1>
			{children}
		</div>
	);
};

SectionHeader.displayName = 'SectionHeader';
