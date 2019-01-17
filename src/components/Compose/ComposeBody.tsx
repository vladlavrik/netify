import * as React from 'react';
// import {Field} from 'formik';
import {RadioButton} from '@/components/@common/RadioButton';
import {TextareaField} from '@/components/@common/TextaredField';
import {requestBodyTypesList} from '@/debugger/constants/RequestBodyType';
import styles from './composeBody.css';

interface Props {
	name: string;
}

export class ComposeBody extends React.PureComponent<Props> {
	render() {
		const {name} = this.props;

		return (
			<div className={styles.root}>
				<div className={styles.typeFieldset}>
					{requestBodyTypesList.map(item => (
						<RadioButton key={item} className={styles.typeItem} name={name + '.type'} value={item}>
							{item}
						</RadioButton>
					))}
				</div>

				<TextareaField className={styles.content} name={name + '.value'} />
			</div>
		);
	}
}
