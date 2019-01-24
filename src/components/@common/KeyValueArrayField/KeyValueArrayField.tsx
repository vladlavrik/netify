import * as React from 'react';
import classNames from 'classnames';
import {FieldArray, getIn} from 'formik';
import {IconButton} from '@/components/@common/IconButton';
import {TextField} from '@/components/@common/TextField';
import styles from './keyValueArrayField.css';

interface Props {
	name: string;
	keyNameSuffix: string,
	valueNameSuffix: string,
	keyPlaceholder?: string,
	valuePlaceholder?: string,
	addControlTitle?: string,
	removeControlTitle?: string,
}

export class KeyValueArrayField extends React.PureComponent<Props> {
	static defaultProps = {
		addControlTitle: 'Add new one',
		removeControlTitle: 'Remove item',
	};

	render() {
		const {
			name,
			keyNameSuffix,
			valueNameSuffix,
			keyPlaceholder,
			valuePlaceholder,
			addControlTitle,
			removeControlTitle
		} = this.props;

		return (
			<ul className={styles.root}>
				<FieldArray
					name={name}
					render={helpers => {
						const list = getIn(helpers.form.values, name);
						return list.map((_: any, index: number) => (
							<li className={styles.item} key={index}>
								<TextField
									className={styles.field}
									name={`${name}[${index}].${keyNameSuffix}`}
									placeholder={keyPlaceholder}
								/>

								<TextField
									className={styles.field}
									name={`${name}[${index}].${valueNameSuffix}`}
									placeholder={valuePlaceholder}
								/>

								{index === list.length - 1 ? (
									<IconButton
										className={classNames(styles.control, styles.typeAdd)}
										tooltip={addControlTitle}
										onClick={() => helpers.push({[keyNameSuffix]: '', [valueNameSuffix]: ''})}
									/>
								) : (
									<IconButton
										className={classNames(styles.control, styles.typeRemove)}
										tooltip={removeControlTitle}
										onClick={() => helpers.remove(index)}
									/>
								)}
							</li>
						));
					}}
				/>
			</ul>
		);
	}
}
