import * as React from 'react';
import {inject} from 'mobx-react';
import {RulesStore} from '@/stores/RulesStore';
import {Button} from '@/components/@common/Button';
import {ExpandableCheckbox} from '@/components/@common/ExpandableCheckbox';
import {Rule} from '@/interfaces/Rule';
import {EditorForm} from './EditorForm';
import {EditorFilter} from './EditorFilter';
import {EditorActionRequest} from './EditorActionRequest';
import {EditorActionResponse} from './EditorActionResponse';
import {EditorActionCancel} from './EditorActionCancel';
import styles from './editor.css';

interface Props {
	rulesStore?: RulesStore;
	initialValues?: Rule;
	onSave: (rule: Rule) => any;
	onCancel: () => any;
}

@inject('rulesStore')
export class Editor extends React.PureComponent<Props> {
	render() {
		const {initialValues, onSave, onCancel} = this.props;

		return (
			<div className={styles.root}>
				<EditorForm className={styles.form} initialValues={initialValues} onSave={onSave}>
					<h3 className={styles.title}>Filter requests:</h3>
					<EditorFilter />

					<h3 className={styles.title}>Actions:</h3>
					<ExpandableCheckbox name='actions.mutateRequest.enabled' label='Mutate request'>
						<EditorActionRequest />
					</ExpandableCheckbox>

					<ExpandableCheckbox name='actions.mutateResponse.enabled' label='Mutate Response'>
						<EditorActionResponse />
					</ExpandableCheckbox>

					<ExpandableCheckbox name='actions.cancelRequest.enabled' label='Cancel'>
						<EditorActionCancel />
					</ExpandableCheckbox>

					<div className={styles.controls}>
						<Button className={styles.saveButton} type='submit'>
							Save
						</Button>
						<Button styleType='secondary' onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</EditorForm>
			</div>
		);
	}
}
