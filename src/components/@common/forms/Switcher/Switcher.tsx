import React, {FC, useMemo} from 'react';
import cn from 'classnames';
import {pseudoRandomHex} from '@/helpers/random';
import styles from './switcher.css';

type NativeInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
type SwitcherProps = Omit<NativeInputProps, 'type'>;

export const Switcher: FC<SwitcherProps> = (props) => {
	const {className, id: propId, ...nativeProps} = props;

	const id = useMemo(() => {
		return propId || `id-switcher-${pseudoRandomHex(8)}`;
	}, [propId]);

	return (
		<div className={cn(styles.root, className)}>
			<input {...nativeProps} id={id} className={styles.input} type='checkbox' />
			<label className={styles.label} htmlFor={id}>
				<svg
					className={styles.imitator}
					width='20'
					height='12'
					viewBox='0 0 20 12'
					xmlns='http://www.w3.org/2000/svg'>
					<defs>
						<mask id='bullet'>
							<rect width='100%' height='100%' fill='white' />
							<circle cx='6' cy='6' r='3' fill='black' className={styles.circle} />
						</mask>
					</defs>
					<rect mask='url(#bullet)' width='20' height='12' rx='6' />
				</svg>
			</label>
		</div>
	);
};

Switcher.displayName = 'Switcher';
