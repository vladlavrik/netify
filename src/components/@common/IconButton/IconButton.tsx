import * as React from 'react';
import classNames from 'classnames';
import styles from './iconButton.css';
import {WithTooltip} from '@/components/@common/WithTooltip';

interface Props {
	className?: string;
	tooltip?: string;
	disabled?: boolean;
	onClick?(event?: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const IconButton = React.memo(({className, tooltip, disabled, onClick}: Props) => (
	<WithTooltip disabled={disabled} tooltip={tooltip}>
		<button className={classNames(styles.root, className)} type='button' disabled={disabled} onClick={onClick} />
	</WithTooltip>
));
