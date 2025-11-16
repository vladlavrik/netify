import React, {memo, useState} from 'react';
import {useField} from 'formik';
import {requestMethodsList} from '@/constants/RequestMethod';
import {resourceTypesList} from '@/constants/ResourceType';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {MultiselectField} from '@/components/@common/forms/MultiselectField';
import {TextField} from '@/components/@common/forms/TextField';
import {PopUpAlert} from '@/components/@common/popups/PopUpAlert';
import {RuleRow} from '../RuleRow';
import InfoIcon from '@/assets/icons/info.svg';
import styles from './ruleFilter.css';

export const RuleFilter = memo(() => {
	const [urlHintShown, setUrlHintShown] = useState(false);
	const [urlField] = useField('filter.url');

	const handleUrlHintShow = () => setUrlHintShown(true);
	const handleUrlHintHide = () => setUrlHintShown(false);

	return (
		<RuleRow className={styles.root} title='Request filter:'>
			<div className={styles.fields}>
				<TextField
					className={styles.urlField}
					placeholder='Url'
					suffixChildren={
						<IconButton
							className={styles.urlInfoButton}
							icon={<InfoIcon />}
							tooltip='Url pattern hint'
							tabIndex={-1}
							onClick={handleUrlHintShow}
						/>
					}
					{...urlField}
				/>

				<MultiselectField
					className={styles.resourceTypesField}
					name='filter.resourceTypes'
					options={resourceTypesList}
					placeholder='Any resource'
				/>
				<MultiselectField
					className={styles.methodsField}
					name='filter.methods'
					options={requestMethodsList}
					placeholder='Any method'
				/>

				{urlHintShown && (
					<PopUpAlert onClose={handleUrlHintHide}>
						<p className={styles.urlInfoText}>
							You can use a pathname only value starting with &quot;/&quot; for the current domain urls.
							<br />
							Otherwise, you must specify the full address value, including a protocol name.
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
		</RuleRow>
	);
});

RuleFilter.displayName = 'RuleFilter';
