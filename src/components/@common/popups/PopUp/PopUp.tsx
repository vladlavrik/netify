import React, {memo, useRef, useEffect, ReactNode} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import styles from './popUp.css';

interface PopUpProps {
	className?: string;
	children?: ReactNode;
}

export const PopUp = memo<PopUpProps>(({className, children}) => {
	const modalRef = useRef<HTMLDialogElement>(null);
	const attachTargetRef = useRef<HTMLElement>(document.getElementById('modal-root')!);

	useEffect(() => {
		modalRef.current!.showModal();
	}, []);

	return ReactDOM.createPortal(
		<dialog ref={modalRef} className={classNames(styles.root, className)}>
			{children}
		</dialog>,
		attachTargetRef.current,
	);
});

PopUp.displayName = 'PopUp';
