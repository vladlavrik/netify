import React, {memo, useEffect, useMemo, useRef} from 'react';
import {autocompletion, closeBrackets} from '@codemirror/autocomplete';
import {json} from '@codemirror/lang-json';
import {bracketMatching, foldGutter} from '@codemirror/language';
import {EditorState} from '@codemirror/state';
import {oneDark} from '@codemirror/theme-one-dark';
import {EditorView, highlightActiveLine, lineNumbers} from '@codemirror/view';
import cn from 'classnames';
import {minimalSetup} from 'codemirror';
import {debounce} from '@/helpers/debounce';
import {isUIColorThemeDark} from '@/helpers/isUIColorThemeDark';
import {useStores} from '@/stores/useStores';
import {InlineButton} from '@/components/@common/buttons/InlineButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import styles from './jsonEditor.css';

interface JSONEditorProps {
	className?: string;
	value: string;
	onChange(newValue: string): void;
}

export const JSONEditor = memo<JSONEditorProps>((props) => {
	const {className, value, onChange} = props;

	const rootRef = useRef<HTMLDivElement>(null);
	const editorViewRef = useRef<EditorView | null>(null);
	const {settingsStore} = useStores();
	const [validationError, setValidationError] = React.useState<string | null>(null);

	const validateJSON = useMemo(() => {
		return debounce((jsonString: string) => {
			if (jsonString.trim()) {
				try {
					JSON.parse(jsonString);
					setValidationError(null);
				} catch (error) {
					setValidationError(error instanceof Error ? error.message : 'Invalid JSON');
				}
			} else {
				setValidationError(null);
			}
		}, 500);
	}, []);

	const handlePrettify = () => {
		const view = editorViewRef.current;
		if (!view) return;

		const currentValue = view.state.doc.toString();

		let parsedValue;
		try {
			parsedValue = JSON.parse(value);
		} catch (_error) {
			return;
		}

		const prettified = JSON.stringify(parsedValue, null, 2);
		view.dispatch({
			changes: {
				from: 0,
				to: currentValue.length,
				insert: prettified,
			},
		});

		view.focus();
	};

	// Initialize editor
	useEffect(() => {
		const startState = EditorState.create({
			doc: value,
			extensions: [
				minimalSetup,
				foldGutter(),
				bracketMatching(),
				closeBrackets(),
				autocompletion({}),
				lineNumbers(),
				json(),
				highlightActiveLine(),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const newValue = update.state.doc.toString();
						onChange(newValue);
						validateJSON(newValue);
					}
				}),
				...(isUIColorThemeDark(settingsStore.values.uiTheme) ? [oneDark] : []),
			],
		});

		const view = new EditorView({
			state: startState,
			parent: rootRef.current!,
		});

		editorViewRef.current = view;

		return () => {
			view.destroy();
			editorViewRef.current = null;
		};
	}, []);

	return (
		<div className={cn(styles.root, className)}>
			<div className={styles.floating}>
				{value.trim() && (
					<div className={styles.controls}>
						<div className={styles.status}>
							{!validationError ? (
								<span className={styles.validStatus}>JSON is valid</span>
							) : (
								<WithTooltip
									className={styles.invalidStatus}
									render={(tooltipProps) => <span {...tooltipProps}>JSON is invalid</span>}
									tooltip={validationError}
								/>
							)}
						</div>
						<InlineButton disabled={!!validationError} onClick={handlePrettify}>
							Prettify
						</InlineButton>
					</div>
				)}
			</div>
			<div ref={rootRef} className={styles.editor}></div>
		</div>
	);
});

JSONEditor.displayName = 'JSONEditor';
