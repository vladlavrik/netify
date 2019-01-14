import * as React from 'react';
import {TextField} from '@/components/@common/TextField';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {urlCompareTypeList} from '@/debugger/constants/UrlCompareType';
import {resourceTypesList} from '@/debugger/constants/ResourceType';
import {requestMethodsList} from '@/debugger/constants/RequestMethod';
import styles from './composeFilter.css';

export class ComposeFilter extends React.Component {
	render() {
		return (
			<div className={styles.root}>
				<TextField className={styles.urlField} name='filter.url' placeholder='Url' />

				<DropdownPicker
					className={styles.urlTypeField}
					name='filter.urlCompareType'
					options={urlCompareTypeList}
				/>

				<div className={styles.separator} />

				<DropdownPicker
					className={styles.resourceTypesField}
					name='filter.resourceTypes'
					options={resourceTypesList}
					multiple
					placeholder='All types'
				/>
				<DropdownPicker
					className={styles.methodsField}
					name='filter.methods'
					options={requestMethodsList}
					multiple
					placeholder='All methods'
				/>
			</div>
		);
	}
}
