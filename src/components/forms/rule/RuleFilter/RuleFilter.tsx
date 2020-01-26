import React, {memo, useCallback, useState} from 'react';
import {resourceTypesList} from '@/constants/ResourceType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {TextField} from '@/components/@common/forms/TextField';
import {SelectField} from '@/components/@common/forms/SelectField';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {PopUpAlert} from '@/components/@common/popups/PopUpAlert';
import {FieldRow} from '@/components/forms/common/FieldRow';
import InfoIcon from './icons/info.svg';
import styles from './ruleFilter.css';

export const RuleFilter = memo(function RuleFilter() {
	const [urlHintShown, setUrlHintShown] = useState(false);

	const handleUrlHintShow = useCallback(() => setUrlHintShown(true), []);
	const handleUrlHintHide = useCallback(() => setUrlHintShown(false), []);

	return (
		<FieldRow className={styles.root} title='Request filter:'>
			<div className={styles.fields}>
				<TextField
					className={styles.urlField}
					name='filter.url'
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
				/>

				<SelectField
					className={styles.resourceTypesField}
					name='filter.resourceTypes'
					options={resourceTypesList}
					multiple
					placeholder='Any resource'
				/>
				<SelectField
					className={styles.methodsField}
					name='filter.methods'
					options={requestMethodsList}
					multiple
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
		</FieldRow>
	);
});
