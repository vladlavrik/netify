import React, {FC, ReactNode, useEffect, useRef} from 'react';
import cn from 'classnames';
import {IconButton} from '@/components/@common/buttons/IconButton';
import CloseIcon from '@/assets/icons/close.svg';
import styles from './modal.css';

const styleTypeOptions = {
	regular: styles.styleRegular,
	attention: styles.styleAttention,
};
interface ModalProps {
	title: ReactNode;
	styleType?: keyof typeof styleTypeOptions;
	footer?: ReactNode;
	onClose?(): void;
	children: ReactNode;
}

export const Modal: FC<ModalProps> = (props) => {
	const {title, styleType = 'regular', footer, onClose, children} = props;

	const modalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		modalRef.current!.showModal();
	}, []);

	return (
		<dialog ref={modalRef} className={styles.root}>
			<header className={cn(styles.header, styleTypeOptions[styleType])}>
				<h1 className={styles.title}>{title}</h1>
				{onClose && <IconButton icon={<CloseIcon />} tooltip='Close' onClick={onClose} />}
			</header>
			<div className={styles.body}>{children}</div>
			{footer && <footer className={styles.footer}>{footer}</footer>}
		</dialog>
	);
};

Modal.displayName = 'Modal';
