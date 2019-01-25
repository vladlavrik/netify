import * as React from 'react';
import classNames from 'classnames';
import {connect, getIn, FormikContext} from 'formik';
import styles from './dropdownPicker.css';

interface PropsFormikPart {
	formik: FormikContext<any>;
}

interface Props {
	classname?: string;
	name: string;
	options: string[];
	className?: string;
	multiple?: boolean;
	disabled?: boolean;
	placeholder?: string;
}
interface State {
	values: string[];
	expanded: boolean;
	expandInverted: boolean;
	contentMaxHeight: number | 'none';
	highlightedIndex: number;
}

class DropdownPickerField extends React.PureComponent<PropsFormikPart & Props, State> {
	static getDerivedStateFromProps(props: PropsFormikPart & Props) {
		let values = getIn(props.formik.values, props.name);

		if (!props.multiple) {
			values = [null, undefined].includes(values)
				? [] // empty array values if passed value is nullable
				: [values];
		}

		return {values};
	}

	private labelRef = React.createRef<HTMLButtonElement>();
	private contentRef = React.createRef<HTMLUListElement>();

	private disabledCollapseBuyBlue = false; // prevent collapse content block by "blur" event after click on an option

	state: State = {
		values: [],
		expanded: false,
		expandInverted: false,
		contentMaxHeight: 'none',
		highlightedIndex: -1,
	};

	render() {
		const {className, options, placeholder} = this.props;
		const {values, expanded, expandInverted, contentMaxHeight, highlightedIndex} = this.state;

		return (
			<div className={classNames(styles.root, className)}>
				<button
					ref={this.labelRef}
					className={classNames(styles.label, values.length === 0 && styles.empty)}
					type='button'
					onClick={this.onToggleExpand}
					onKeyDown={this.onKeydownAction}
					onBlur={this.onCollapse}>
					{values.join(', ') || placeholder}
				</button>

				{expanded && (
					<ul
						ref={this.contentRef}
						className={classNames(styles.content, expandInverted && styles.inverted)}
						style={{maxHeight: contentMaxHeight}}>
						{options.map((option, index) => (
							<li
								className={classNames({
									[styles.option]: true,
									[styles.selected]: values.includes(option),
									[styles.highlighted]: index === highlightedIndex,
								})}
								key={option}
								data-index={index}
								onClick={this.onOptionSelect}
								onPointerDown={this.onRegisterPreventBlur}>
								{option}
							</li>
						))}
					</ul>
				)}
			</div>
		);
	}

	private onToggleExpand = () => {
		this.setState(
			state => ({expanded: !state.expanded}),
			() => {
				if (this.state.expanded) {
					this.updateContentPosition();
				}
			},
		);
	};

	private onCollapse = () => {
		if (this.disabledCollapseBuyBlue) {
			this.disabledCollapseBuyBlue = false;
			this.labelRef.current!.focus();
		} else {
			this.collapse();
		}
	};

	private onRegisterPreventBlur = () => {
		this.disabledCollapseBuyBlue = true;
	};

	private onOptionSelect = (event: React.MouseEvent<HTMLLIElement>) => {
		const {multiple} = this.props;
		const index = +(event.target as HTMLLIElement).dataset.index!;
		const selectedOption = this.props.options[index];

		const allowMultiple = event.metaKey || event.shiftKey;

		if (!multiple || !allowMultiple) {
			this.collapse();
		}

		this.selectOption(selectedOption, allowMultiple);
	};

	private onKeydownAction = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		const {options, multiple} = this.props;
		const {highlightedIndex} = this.state;

		const {expanded} = this.state;
		const {code} = event.nativeEvent;
		switch (code) {
			case 'Escape':
				// Collapse only
				event.preventDefault();
				this.collapse();
				break;

			case 'Enter':
			case 'Space':
				// Select single or multi highlighted options if expanded or expand if not yet
				event.preventDefault();
				if (!expanded) {
					this.expand();
					break;
				}

				if (this.state.highlightedIndex === -1) {
					this.collapse();
					break;
				}

				const allowMultiple = code === 'Space';
				const option = options[highlightedIndex];
				this.selectOption(option, allowMultiple);
				if (!multiple || !allowMultiple) {
					this.collapse();
				}
				break;

			case 'ArrowUp':
				event.preventDefault();
				if (expanded) {
					this.moveHighlight(-1);
				} else {
					this.expand();
				}
				break;

			case 'ArrowDown':
				event.preventDefault();
				if (expanded) {
					this.moveHighlight(+1);
				} else {
					this.expand();
				}
				break;
		}
	};

	private expand() {
		this.setState({expanded: true}, this.updateContentPosition);
	}

	private updateContentPosition = () => {
		const labelNode = this.labelRef.current!;
		const contentNode = this.contentRef.current!;

		const minPadding = 8;
		const viewportHeight = document.documentElement!.clientHeight;
		const labelRect = labelNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();

		if (viewportHeight - contentRect.bottom >= minPadding) {
			// if enough space to expand bottom
			return;
		}

		let maxHeight;
		const topFree = labelRect.top;
		const bottomFree = viewportHeight - labelRect.bottom;

		if (topFree > bottomFree) {
			// if more space above - expand to top
			this.setState({expandInverted: true});
			maxHeight = topFree;
		} else {
			maxHeight = bottomFree;
		}

		this.setState({contentMaxHeight: maxHeight - minPadding});
	};

	private collapse() {
		this.setState({
			expanded: false,
			expandInverted: false,
			contentMaxHeight: 'none',
		});
	}

	private selectOption(option: string, allowMultiple: boolean) {
		const {values} = this.state;
		const {formik, name, options, multiple} = this.props;

		if (!multiple) {
			formik.setFieldValue(name, option);
			return;
		}

		if (!allowMultiple) {
			formik.setFieldValue(name, [option]);
			return;
		}

		let newValue = options.filter(itemOption => {
			if (option === itemOption) {
				return !values.includes(itemOption);
			}
			return values.includes(itemOption);
		});

		formik.setFieldValue(name, newValue);
	}

	private moveHighlight(delta: number) {
		this.setState(({highlightedIndex}) => {
			const maxIndex = this.props.options.length - 1;
			let newIndex = highlightedIndex + delta;

			if (newIndex < 0) {
				newIndex = maxIndex;
			} else if (newIndex > maxIndex) {
				newIndex = 0;
			}

			return {highlightedIndex: newIndex};
		});
	}
}

export const DropdownPicker = connect<Props, any>(DropdownPickerField);
