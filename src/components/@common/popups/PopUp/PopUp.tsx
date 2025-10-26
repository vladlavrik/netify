import React, {FC, ReactNode, useEffect, useRef} from 'react';
import cn from 'classnames';
import styles from './popUp.css';

interface PopUpProps {
	className?: string;
	onClose(): void;
	children?: ReactNode;
}

export const PopUp: FC<PopUpProps> = (props) => {
	const {className, onClose, children} = props;
	const modalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		modalRef.current!.showModal();
		modalRef.current!.addEventListener('close', onClose);
	}, []);

	return (
		<dialog ref={modalRef} className={cn(styles.root, className)}>
			{children}
		</dialog>
	);
};

PopUp.displayName = 'PopUp';
