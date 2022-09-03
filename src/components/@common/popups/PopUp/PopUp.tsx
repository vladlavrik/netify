import React, {FC, ReactNode, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import styles from './popUp.css';

interface PopUpProps {
	className?: string;
	children?: ReactNode;
}

export const PopUp: FC<PopUpProps> = ({className, children}) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const attachTargetRef = useRef<HTMLElement>(document.getElementById('modal-root')!);

	useEffect(() => {
		(modalRef.current! as any).showModal(); // TODO fix types
	}, []);

	return ReactDOM.createPortal(
		<dialog ref={modalRef} className={cn(styles.root, className)}>
			{children}
		</dialog>,
		attachTargetRef.current,
	);
};

PopUp.displayName = 'PopUp';
