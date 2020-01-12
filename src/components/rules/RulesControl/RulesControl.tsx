import React, {memo, useCallback} from 'react';
import cn from 'classnames';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
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
		<menu className={styles.root}>
			<li className={styles.entry}>
				<Checkbox className={styles.checkbox} checked={ruleIsActive} onChange={onActiveToggle}>
					Active
				</Checkbox>
				{allowMoveAbove && (
					<IconButton className={cn(styles.button, styles.moveAbove)} onClick={handleMoveAbove}>
						Move above
					</IconButton>
				)}
				{allowMoveBelow && (
					<IconButton className={cn(styles.button, styles.moveBelow)} onClick={handleMoveBelow}>
						Move below
					</IconButton>
				)}
				<IconButton className={cn(styles.button, styles.edit)} onClick={onEdit}>
					Edit
				</IconButton>
				<IconButton className={cn(styles.button, styles.remove)} onClick={onRemove}>
					Remove
				</IconButton>
			</li>
		</menu>
	);
});
