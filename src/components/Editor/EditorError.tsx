import * as React from 'react';
import {ErrorMessage} from 'formik';
import styles from './editorError.css';

interface Props {
	name: string;
}

export class EditorError extends React.PureComponent<Props> {
	render() {
		return (
			<p className={styles.root}>
				<ErrorMessage name={this.props.name} />
			</p>
		);
	}
}
