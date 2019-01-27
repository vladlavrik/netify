import * as React from 'react';
import {ErrorMessage} from 'formik';
import styles from './composeError.css';

interface Props {
	name: string;
}

export class ComposeError extends React.PureComponent<Props> {
	render() {
		return (
			<p className={styles.root}>
				<ErrorMessage name={this.props.name} />
			</p>
		);
	}
}
