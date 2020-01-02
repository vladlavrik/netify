import React, {memo, useCallback, useState} from 'react';
import {resourceTypesList} from '@/constants/ResourceType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {TextField} from '@/components/@common/forms/TextField';
import {SelectField} from '@/components/@common/forms/SelectField';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {PopUpAlert} from '@/components/@common/popups/PopUpAlert';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleFilter.css';

export const RuleFilter = memo(() => {
	const [urlHintShown, setUrlHintShown] = useState(false);

	const handleUrlHintShow = useCallback(() => setUrlHintShown(true), []);
	const handleUrlHintHide = useCallback(() => setUrlHintShown(false), []);

	return (
		<FieldRow className={styles.root} title='Request filter'>
			<div className={styles.fields}>
				<TextField
					className={styles.urlField}
					name='filter.url'
					placeholder='Url'
					suffix={
						<IconButton
							tabIndex={-1}
							className={styles.urlInfoButton}
							tooltip='Url pattern hint'
							onClick={handleUrlHintShow}
						/>
					}
				/>

				<SelectField
					className={styles.resourceTypesField}
					name='filter.resourceTypes'
					options={resourceTypesList}
					multiple
					placeholder='All resources'
				/>
				<SelectField
					className={styles.methodsField}
					name='filter.methods'
					options={requestMethodsList}
					multiple
					placeholder='All methods'
				/>

				{urlHintShown && (
					<PopUpAlert onClose={handleUrlHintHide}>
						<p className={styles.urlInfoText}>
							As an url filter value can be used pathname only, when the value starts with &quot;/&quot; .
							<br />
							Or the full url with a domain if the value starts with a protocol name.
							<br />
							<br />
							You can also use special marks:
							<br />
							<span className={styles.urlInfoMark}>?</span> - matches any single character
							<br />
							<span className={styles.urlInfoMark}>*</span> - matches any zero or more characters
						</p>
					</PopUpAlert>
				)}
			</div>
		</FieldRow>
	);
});

RuleFilter.displayName = 'RuleFilter';
