import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import styles from './popUp.css';

interface Props {
	className?: string;
	children?: React.ReactNode;
}

export const PopUp = React.memo(({className, children}: Props) => {
	const modalRef = React.useRef<HTMLDialogElement>(null);
	const attachTargetRef = React.useRef<HTMLElement>(document.getElementById('modal-root')!);

	React.useEffect(() => {
		modalRef.current!.showModal();
	}, []);

	return ReactDOM.createPortal(
		<dialog ref={modalRef} className={classNames(styles.root, className)}>
			{children}
		</dialog>,
		attachTargetRef.current,
	);
});
