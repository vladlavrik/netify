import React, {memo, useCallback} from 'react';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {useStores} from '@/stores/useStores';
import AboveIcon from '@/assets/icons/above.svg';
import BelowIcon from '@/assets/icons/below.svg';
import CheckActiveIcon from '@/assets/icons/check-active.svg';
import CheckInactiveIcon from '@/assets/icons/check-inactive.svg';
import EditIcon from '@/assets/icons/edit.svg';
import RemoveIcon from '@/assets/icons/remove.svg';
import styles from './rulesItemControls.css';

interface RulesItemControlsProps {
	ruleId: string;
	ruleIsActive: boolean;
	allowMoveAbove: boolean;
	allowMoveBelow: boolean;
	onClose(): void;
}

export const RulesItemControls = memo<RulesItemControlsProps>((props) => {
	const {ruleId, ruleIsActive, allowMoveAbove, allowMoveBelow, onClose} = props;

	const {rulesStore} = useStores();

	const handleEdit = useCallback(() => {
		rulesStore.showEditor(ruleId);
		onClose();
	}, [ruleId]);

	const handleActiveToggle = async () => {
		rulesStore.updateRuleActive(ruleId, !ruleIsActive);
	};

	const handleMove = async (shift: 1 | -1) => {
		// TODO in future
	};

	const handleMoveAbove = () => handleMove(-1);
	const handleMoveBelow = () => handleMove(1);

	const handleRemove = () => {
		rulesStore.initRemoveConfirm([ruleId]);
	};

	return (
		<div className={styles.root}>
			<TextButton
				className={styles.control}
				icon={ruleIsActive ? <CheckActiveIcon /> : <CheckInactiveIcon />}
				onClick={handleActiveToggle}>
				Active
			</TextButton>

			{allowMoveAbove && false && (
				<TextButton className={styles.control} icon={<AboveIcon />} onClick={handleMoveAbove}>
					Move above
				</TextButton>
			)}

			{allowMoveBelow && false && (
				<TextButton className={styles.control} icon={<BelowIcon />} onClick={handleMoveBelow}>
					Move below
				</TextButton>
			)}

			<TextButton className={styles.control} icon={<EditIcon />} onClick={handleEdit}>
				Edit
			</TextButton>

			<TextButton className={styles.control} icon={<RemoveIcon />} onClick={handleRemove}>
				Remove
			</TextButton>
		</div>
	);
});

RulesItemControls.displayName = 'RulesItemControls';
