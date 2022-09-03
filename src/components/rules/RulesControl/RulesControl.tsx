import React, {memo, useCallback} from 'react';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import AboveIcon from './icons/above.svg';
import BelowIcon from './icons/below.svg';
import EditIcon from './icons/edit.svg';
import RemoveIcon from './icons/remove.svg';
import styles from './rulesControl.css';

interface RulesControlProps {
	ruleIsActive: boolean;
	allowMoveAbove: boolean;
	allowMoveBelow: boolean;
	onActiveToggle(): void;
	onMove(offset: number): void;
	onEdit(): void;
	onRemove(): void;
}

export const RulesControl = memo<RulesControlProps>(function RulesControl(props) {
	const {ruleIsActive, allowMoveAbove, allowMoveBelow, onActiveToggle, onMove, onEdit, onRemove} = props;

	const handleMoveAbove = useCallback(() => onMove(-1), [onMove]);
	const handleMoveBelow = useCallback(() => onMove(1), [onMove]);

	return (
		<div className={styles.root}>
			<Checkbox className={styles.checkbox} checked={ruleIsActive} onChange={onActiveToggle}>
				Active
			</Checkbox>
			{allowMoveAbove && (
				<IconButton className={styles.button} icon={<AboveIcon />} onClick={handleMoveAbove}>
					Move above
				</IconButton>
			)}
			{allowMoveBelow && (
				<IconButton className={styles.button} icon={<BelowIcon />} onClick={handleMoveBelow}>
					Move below
				</IconButton>
			)}
			<IconButton className={styles.button} icon={<EditIcon />} onClick={onEdit}>
				Edit
			</IconButton>
			<IconButton className={styles.button} icon={<RemoveIcon />} onClick={onRemove}>
				Remove
			</IconButton>
		</div>
	);
});
