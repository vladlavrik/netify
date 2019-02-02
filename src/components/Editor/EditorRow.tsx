import * as React from 'react';
import styles from './editorRow.css';

interface Props {
	title: string;
}

export class EditorRow extends React.PureComponent<Props> {
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
