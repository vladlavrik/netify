import React, {memo, ReactNode} from 'react';
import cn from 'classnames';
import styles from './fieldRow.css';

interface FieldRowProps {
	className?: string;
	title: ReactNode;
	children?: ReactNode;
}

export const FieldRow = memo<FieldRowProps>(function FieldRow({className, title, children}) {
	return (
		<div className={cn(styles.root, className)}>
			<p className={styles.title}>{title}</p>
			{children}
		</div>
	);
});
