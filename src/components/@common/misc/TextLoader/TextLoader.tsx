import React, {FC, useEffect, useState} from 'react';
import cn from 'classnames';
import styles from './textLoader.css';

interface TextLoaderProps {
	className?: string;
	showDelay?: number;
}

export const TextLoader: FC<TextLoaderProps> = (props) => {
	const {className, showDelay} = props;

	const [chars, setChars] = useState('');

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setChars((prevValue) => {
				if (prevValue.length === 3) {
					return '';
				}
				return `${prevValue}.`;
			});
		}, 200);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<span
			className={cn(styles.root, showDelay && styles.withDelay, className)}
			style={showDelay ? {animationDelay: `${showDelay}ms`} : undefined}>
			{chars}
		</span>
	);
};

TextLoader.displayName = 'TextLoader';
