import React, {FC, ReactNode} from 'react';
import styles from './sectionHeader.css';

interface SectionHeaderProps {
	title: ReactNode;
	leading?: ReactNode;
	trailing?: ReactNode;
}

export const SectionHeader: FC<SectionHeaderProps> = (props) => {
	const {title, leading, trailing} = props;

	return (
		<div className={styles.root}>
			<div className={styles.leading}>
				<h1 className={styles.title}>{title}</h1>
				{leading}
			</div>
			{trailing}
		</div>
	);
};

SectionHeader.displayName = 'SectionHeader';
