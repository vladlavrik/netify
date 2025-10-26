import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {Dropdown} from '@/components/@common/misc/Dropdown';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {RulesSettings} from '../RulesSettings';
import AddIcon from '@/assets/icons/add.svg';
import CheckActiveIcon from '@/assets/icons/check-active.svg';
import CheckInactiveIcon from '@/assets/icons/check-inactive.svg';
import CloseIcon from '@/assets/icons/close.svg';
import ExportIcon from '@/assets/icons/export.svg';
import MoreIcon from '@/assets/icons/more.svg';
import RemoveIcon from '@/assets/icons/remove.svg';
import MultiselectIcon from '@/assets/icons/select.svg';
import styles from './rulesHeader.css';

export const RulesHeader = observer(() => {
	const {rulesStore} = useStores();
	const {hasAnyRules, multiselectMode, originToFilter, hasSelectedRules, isAllRulesSelected} = rulesStore;
	const hasInactiveSelectedRule = hasSelectedRules && rulesStore.isSelectedHasInactive;

	const handleComposeShow = () => {
		rulesStore.showCompose();
	};

	const handleSelectAllSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		if (checked) {
			rulesStore.selectAll();
		} else {
			rulesStore.unselectAll();
		}
	};

	const handleMultiselectInit = () => {
		rulesStore.initMultiselect();
	};

	const handleMultiselectCancel = () => {
		rulesStore.finishMultiselect();
	};

	const handleExportSelected = async () => {
		const selectedRules = rulesStore.selectedRules.slice();
		const {success} = await rulesStore.exportRules(selectedRules);
		if (success) {
			rulesStore.finishMultiselect();
		}
	};

	const handleMakeSelectedActive = async () => {
		const selectedRules = rulesStore.selectedRules.slice();
		await Promise.any(selectedRules.map((rule) => rulesStore.updateRuleActive(rule.id, true)));
	};

	const handleMakeSelectedInactive = async () => {
		const selectedRules = rulesStore.selectedRules.slice();
		await Promise.any(selectedRules.map((rule) => rulesStore.updateRuleActive(rule.id, false)));
	};

	const handleRemoveSelected = async () => {
		const selectedIds = rulesStore.selectedRules.map((item) => item.id);
		rulesStore.initRemoveConfirm(selectedIds);
	};

	useEffect(() => {
		if (multiselectMode) {
			handleMultiselectCancel();
		}
	}, [hasAnyRules, originToFilter]);

	return (
		<>
			<SectionHeader
				title={
					<div className={styles.leading}>
						{multiselectMode ? (
							<>
								<Checkbox
									className={styles.leadingControl}
									checked={isAllRulesSelected}
									onChange={handleSelectAllSwitch}
								/>
								<div className={styles.separator}></div>
								<IconButton
									className={styles.leadingControl}
									icon={<ExportIcon />}
									tooltip='Export selected rules'
									disabled={!hasSelectedRules}
									onClick={handleExportSelected}
								/>
								<IconButton
									className={styles.leadingControl}
									icon={hasInactiveSelectedRule ? <CheckActiveIcon /> : <CheckInactiveIcon />}
									tooltip={
										hasInactiveSelectedRule
											? 'Make all selected active'
											: 'Make all selected inactive'
									}
									disabled={!hasSelectedRules}
									onClick={
										hasInactiveSelectedRule ? handleMakeSelectedActive : handleMakeSelectedInactive
									}
								/>
								<IconButton
									className={styles.leadingControl}
									icon={<RemoveIcon />}
									tooltip='Remove selected rules'
									disabled={!hasSelectedRules}
									onClick={handleRemoveSelected}
								/>
							</>
						) : (
							<>
								Rules
								{hasAnyRules && (
									<>
										<div className={styles.separator}></div>
										<IconButton
											className={styles.leadingControl}
											icon={<MultiselectIcon />}
											tooltip='Enter multiselect mode'
											onClick={handleMultiselectInit}
										/>
									</>
								)}
							</>
						)}
					</div>
				}
				trailing={
					multiselectMode ? (
						<IconButton
							className={styles.tailControl}
							icon={<CloseIcon />}
							tooltip='Cancel multiselect'
							onClick={handleMultiselectCancel}
						/>
					) : (
						<>
							<IconButton
								className={styles.tailControl}
								icon={<AddIcon />}
								tooltip='Add a new rule'
								onClick={handleComposeShow}
							/>
							<Dropdown
								className={styles.tailControl}
								render={(dropdownProps, {expanded}) => (
									<IconButton {...dropdownProps} icon={<MoreIcon />} active={expanded} />
								)}
								preferExpansionAlign='left'
								content={({collapse}) => <RulesSettings onClose={collapse} />}
							/>
						</>
					)
				}
			/>
		</>
	);
});

RulesHeader.displayName = 'RulesHeader';
