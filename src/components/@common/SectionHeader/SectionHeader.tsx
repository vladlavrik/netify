import * as React from 'react';
import styles from './sectionHeader.css';

interface Props {
	title: string;
	children?: React.ReactNode;
}

export class SectionHeader extends React.PureComponent<Props> {
	render() {
		const {title, children} = this.props;

		return (
			<div className={styles.root}>
				<p className={styles.title}>{title}</p>
				{children}
			</div>
		);
	}
}
