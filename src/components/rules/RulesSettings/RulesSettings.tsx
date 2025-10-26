import React, {useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import CheckActiveIcon from '@/assets/icons/check-active.svg';
import CheckInactiveIcon from '@/assets/icons/check-inactive.svg';
import ClearIcon from '@/assets/icons/clear.svg';
import ExportIcon from '@/assets/icons/export.svg';
import ImportIcon from '@/assets/icons/import.svg';
import styles from './rulesSettings.css';

interface RulesSettingsProps {
	onClose(): void;
}

export const RulesSettings = observer<RulesSettingsProps>((props) => {
	const {onClose} = props;

	const {rulesStore} = useStores();
	const hasRules = rulesStore.hasAnyRules;
	const filterByOrigin = rulesStore.filterByOrigin;

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const handleToggleFilterByOrigin = () => {
		rulesStore.toggleFilterByOrigin();
	};

	const handleImportInit = () => {
		importFileInputRef.current!.click();
	};

	const handleImportPick = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files![0];
		rulesStore.importRules(file);
		event.currentTarget.value = '';
		onClose();
	};

	const handleExportAll = () => {
		const allRules = rulesStore.list.slice();
		rulesStore.exportRules(allRules);
		onClose();
	};

	const handleRemoveAllConfirm = () => {
		rulesStore.initRemoveAllConfirm();
		onClose();
	};

	return (
		<div className={styles.root}>
			<WithTooltip
				className={styles.control}
				tooltip={
					<span>
						If checked - only rules created within
						<br />
						the current page origin are shown
						<br />
						in the list of rules.
					</span>
				}
				render={(tooltipProps) => (
					<TextButton
						{...tooltipProps}
						icon={filterByOrigin ? <CheckActiveIcon /> : <CheckInactiveIcon />}
						onClick={handleToggleFilterByOrigin}>
						Rules per site
					</TextButton>
				)}
			/>

			<input
				ref={importFileInputRef}
				className={styles.hiddenFileInput}
				type='file'
				accept='.json'
				onChange={handleImportPick}
			/>
			<TextButton className={styles.control} icon={<ImportIcon />} onClick={handleImportInit}>
				Import rules
			</TextButton>

			<TextButton className={styles.control} icon={<ExportIcon />} disabled={!hasRules} onClick={handleExportAll}>
				Export all rules
			</TextButton>

			<TextButton
				className={styles.control}
				icon={<ClearIcon />}
				disabled={!hasRules}
				onClick={handleRemoveAllConfirm}>
				Remove all rules
			</TextButton>
		</div>
	);
});

RulesSettings.displayName = 'RulesHeader';
