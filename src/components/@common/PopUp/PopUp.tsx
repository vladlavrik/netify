import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import styles from './popUp.css';

interface Props {
	className?: string;
}

export class PopUp extends React.PureComponent<Props> {
	private readonly attachTarget = document.getElementById('modal-root')!;

	private readonly modalRef = React.createRef<HTMLDialogElement>();

	render() {
		const {className, children} = this.props;
		return ReactDOM.createPortal(
			<dialog ref={this.modalRef} className={classNames(styles.root, className)}>
				{children}
			</dialog>,
			this.attachTarget,
		);
	}

	componentDidMount() {
		this.modalRef.current!.showModal();
	}
}
