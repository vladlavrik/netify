import * as React from 'react';
import {TextField} from '@/components/@common/TextField';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {urlCompareTypeList} from '@/constants/UrlCompareType';
import {resourceTypesList} from '@/constants/ResourceType';
import {requestMethodsList} from '@/constants/RequestMethod';
import styles from './editorFilter.css';

export class EditorFilter extends React.PureComponent {
	render() {
		return (
			<div className={styles.root}>
				<TextField
					className={styles.urlField}
					name='filter.url.value'
					placeholder='Url (includes hostname or only path when starts with "/")'
				/>
				<DropdownPicker
					className={styles.urlTypeField}
					name='filter.url.compareType'
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
