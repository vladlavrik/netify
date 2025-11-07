import React, {memo, useCallback, useEffect, useRef} from 'react';
import {autocompletion, closeBrackets} from '@codemirror/autocomplete';
import {json} from '@codemirror/lang-json';
import {bracketMatching, foldGutter} from '@codemirror/language';
import {search, openSearchPanel, searchKeymap} from '@codemirror/search';
import {EditorState} from '@codemirror/state';
import {oneDark} from '@codemirror/theme-one-dark';
import {EditorView, highlightActiveLine, keymap, lineNumbers} from '@codemirror/view';
import {minimalSetup} from 'codemirror';
import {isUIColorThemeDark} from '@/helpers/isUIColorThemeDark';
import {useDebounce} from '@/hooks/useDebounce';
import {useStores} from '@/stores/useStores';
import {InlineButton} from '@/components/@common/buttons/InlineButton';
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

	const validateJSON = useCallback((jsonString: string) => {
		if (jsonString.trim()) {
			try {
				JSON.parse(jsonString);
				setValidationError(null);
			} catch (error) {
				setValidationError(error.message);
			}
		} else {
			setValidationError(null);
		}
	}, []);

	const debouncedValidate = useDebounce(validateJSON, 500);

	const handlePrettify = useCallback(() => {
		const view = editorViewRef.current;
		if (!view) return;

		const currentValue = view.state.doc.toString();

		try {
			const parsed = JSON.parse(currentValue);
			const prettified = JSON.stringify(parsed, null, 2);

			// Directly update the editor content
			view.dispatch({
				changes: {
					from: 0,
					to: currentValue.length,
					insert: prettified,
				},
			});
			// The updateListener will call onChange automatically
		} catch (error) {
			// Keep original value if invalid JSON
			console.warn('[JSONEditor] Failed to prettify JSON:', error);
		}
	}, []);

	const handleSearch = useCallback(() => {
		const view = editorViewRef.current;
		if (!view) return;

		openSearchPanel(view);
	}, []);

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
				search({
					top: false,
				}),
				keymap.of(searchKeymap),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const newValue = update.state.doc.toString();
						onChange(newValue);
						debouncedValidate(newValue);
					}
				}),
				...(isUIColorThemeDark(settingsStore.uiTheme) ? [oneDark] : []),
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
		<div className={className}>
			<div className={styles.controls}>
				<InlineButton onClick={handlePrettify}>Prettify</InlineButton>
				<InlineButton onClick={handleSearch}>Search</InlineButton>
			</div>
			<div ref={rootRef} className={styles.editor}></div>
			{validationError && <p className={styles.error}>{validationError}</p>}
		</div>
	);
});

JSONEditor.displayName = 'JSONEditor';
