import React, {memo, useCallback, useEffect, useRef} from 'react';
import {autocompletion, closeBrackets} from '@codemirror/autocomplete';
import {json} from '@codemirror/lang-json';
import {bracketMatching, foldGutter} from '@codemirror/language';
import {EditorState} from '@codemirror/state';
import {oneDark} from '@codemirror/theme-one-dark';
import {EditorView, highlightActiveLine, lineNumbers} from '@codemirror/view';
import {minimalSetup} from 'codemirror';
import {isUIColorThemeDark} from '@/helpers/isUIColorThemeDark';
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

	const handlePrettify = useCallback(() => {
		const currentValue = editorViewRef.current?.state.doc.toString() || '';

		try {
			const parsed = JSON.parse(currentValue);
			const prettified = JSON.stringify(parsed, null, 2);
			console.log('prettified:', prettified);
			onChange(prettified);
		} catch (error) {
			// Keep original value if invalid JSON
			console.warn('[JSONEditor] Failed to prettify JSON:', error);
		}
	}, [onChange]);

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
						onChange(update.state.doc.toString());
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
			</div>
			<div ref={rootRef}></div>
		</div>
	);
});

JSONEditor.displayName = 'JSONEditor';
