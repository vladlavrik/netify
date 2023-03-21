import React, {memo, useState} from 'react';
import {useField} from 'formik';
import {requestMethodsList} from '@/constants/RequestMethod';
import {resourceTypesList} from '@/constants/ResourceType';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {MultiselectField} from '@/components/@common/forms/MultiselectField';
import {TextField} from '@/components/@common/forms/TextField';
import {PopUpAlert} from '@/components/@common/popups/PopUpAlert';
import {RuleRow} from '../RuleRow';
import InfoIcon from './icons/info.svg';
import styles from './ruleFilter.css';

export const RuleFilter = memo(() => {
	const [urlHintShown, setUrlHintShown] = useState(false);
	const [urlField] = useField('filter.url');

	const handleUrlHintShow = () => setUrlHintShown(true);
	const handleUrlHintHide = () => setUrlHintShown(false);

	return (
		<RuleRow className={styles.root} title={chrome.i18n.getMessage('requestFilter')}>
			<div className={styles.fields}>
				<TextField
					className={styles.urlField}
					placeholder={chrome.i18n.getMessage('url2')}
					suffixChildren={
						<IconButton
							className={styles.urlInfoButton}
							icon={<InfoIcon />}
							tooltip={chrome.i18n.getMessage('urlPatternHint')}
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
					multiple
					placeholder={chrome.i18n.getMessage('anyResource')}
				/>
				<MultiselectField
					className={styles.methodsField}
					name='filter.methods'
					options={requestMethodsList}
					multiple
					placeholder={chrome.i18n.getMessage('anyMethod')}
				/>

				{urlHintShown && (
					<PopUpAlert onClose={handleUrlHintHide}>
						<p className={styles.urlInfoText}>
							{chrome.i18n.getMessage('youCanUsePathname')}
							<br />
							{chrome.i18n.getMessage('otherwiseYouMustSpecifyFullAddress')}
							<br />
							<br />
							{chrome.i18n.getMessage('youCanAlsoUseSpecialMarks')}
							<br />
							<span className={styles.urlInfoMark}>?</span> -{' '}
							{chrome.i18n.getMessage('matchesAnySingleCharacter')}
							<br />
							<span className={styles.urlInfoMark}>*</span> -{' '}
							{chrome.i18n.getMessage('matchesAnyZeroOrMoreCharacters')}
						</p>
					</PopUpAlert>
				)}
			</div>
		</RuleRow>
	);
});

RuleFilter.displayName = 'RuleFilter';
