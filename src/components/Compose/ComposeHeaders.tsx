import * as React from 'react';
import classNames from 'classnames';
import {FieldArray, getIn} from 'formik';
import {IconButton} from '@/components/@common/IconButton';
import {TextField} from '@/components/@common/TextField';
import styles from './composeHeaders.css';

interface Props {
	name: string;
}

export class ComposeHeaders extends React.Component<Props> {
	render() {
		const {name} = this.props;
		return (
			<ul className={styles.root}>
				<FieldArray
					name={name}
					render={helpers => {
						const list = getIn(helpers.form.values, name);
						return list.map((_: any, index: number) => (
							<div className={styles.item} key={index}>
								<TextField
									className={styles.field}
									name={`${name}[${index}].name`}
									placeholder='Header name'
								/>

								<TextField
									className={styles.field}
									name={`${name}[${index}].value`}
									placeholder='Header value (leave empty for delete)'
								/>

								{index === list.length - 1 ? (
									<IconButton
										className={classNames(styles.control, styles.typeAdd)}
										tooltip='Add new one'
										onClick={() => helpers.push({name: '', value: 'v'})}
									/>
								) : (
									<IconButton
										className={classNames(styles.control, styles.typeRemove)}
										tooltip='Remove item'
										onClick={() => helpers.remove(index)}
									/>
								)}
							</div>
						));
					}}
				/>
			</ul>
		);
	}
}
