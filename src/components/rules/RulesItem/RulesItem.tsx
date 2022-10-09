import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import cn from 'classnames';
import {toJS} from 'mobx';
import {observer} from 'mobx-react-lite';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {Rule} from '@/interfaces/rule';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {Dropdown, DropdownRef} from '@/components/@common/misc/Dropdown';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import {useStores} from '@/stores/useStores';
import {RulesControl} from '../RulesControl';
import MoreIcon from './icons/more.svg';
import {stringifyActionsSummary} from './stringifyActionsSummary';
import styles from './rulesItem.css';

const methodLabelColors: Record<RequestMethod, string> = {
	[RequestMethod.GET]: '#0d5202',
	[RequestMethod.POST]: '#154260',
	[RequestMethod.PUT]: '#776a16',
	[RequestMethod.DELETE]: '#790d06',
	[RequestMethod.PATCH]: '#496671',
	[RequestMethod.HEAD]: '#616161',
};

const resourceLabelColors: Record<ResourceType, string> = {
	[ResourceType.XHR]: '#316890',
	[ResourceType.Fetch]: '#151579',
	[ResourceType.Script]: '#71713f',
	[ResourceType.Stylesheet]: '#793556',
	[ResourceType.Document]: '#34825f',
	[ResourceType.Font]: '#544c46',
	[ResourceType.Image]: '#985a24',
	[ResourceType.Media]: '#1b5490',
};

interface RulesItemProps {
	data: Rule;
	isStartEdgePosition: boolean; // Is the item leading or trailing in the list
	isEndEdgePosition: boolean; // Is the item leading or trailing in the list
	isHighlighted: boolean;
	isExportMode: boolean;
	isSelected: boolean;
}

export const RulesItem = observer<RulesItemProps>((props) => {
	const {data, isStartEdgePosition, isEndEdgePosition, isHighlighted, isExportMode, isSelected} = props;
	const {id: ruleId, label, active, filter, action} = data;
	const {url, methods, resourceTypes} = filter;

	const {rulesStore} = useStores();

	const [showRemoveAsk, setShowRemoveAsk] = useState(false);

	const rootRef = useRef<HTMLLIElement>(null);

	const actionsSummary = useMemo(() => stringifyActionsSummary(action), [action]);

	const dropdownRef = useRef<DropdownRef>(null);

	const handleShowDetails = () => {
		rulesStore.showDetails(ruleId);
	};

	const handleShowDetailsByKeyboard = ({key}: React.KeyboardEvent) => {
		if (key === ' ' || key === 'Enter') {
			handleShowDetails();
		}
	};

	const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.checked) {
			rulesStore.selectItem(ruleId);
		} else {
			rulesStore.unselectItem(ruleId);
		}
	};

	const handleEdit = useCallback(() => {
		rulesStore.showEditor(ruleId);
		dropdownRef.current!.collapse();
	}, [ruleId]);

	const handleActiveToggle = useCallback(async () => {
		rulesStore.updateRule({...toJS(data), active: !data.active});
	}, [data]);

	const handleMove = useCallback(async () => {
		// TODO in future
	}, [ruleId]);

	const handleRemove = useCallback(() => {
		setShowRemoveAsk(true);
		dropdownRef.current!.collapse();
	}, []);

	const handleRemoveCancel = () => {
		setShowRemoveAsk(false);
	};

	const handleRemoveConfirm = async () => {
		rulesStore.removeRule(ruleId);
		setShowRemoveAsk(false);
	};

	useEffect(() => {
		if (isHighlighted && rootRef.current) {
			(rootRef.current as any).scrollIntoViewIfNeeded(true);
		}
	}, [isHighlighted]);

	return (
		<li ref={rootRef} className={cn(styles.root, isHighlighted && styles.highlighted)}>
			{isExportMode && (
				<Checkbox className={styles.selectCheckbox} checked={isSelected} onChange={handleSelectionChange} />
			)}

			<div className={styles.entry} role='button' onClick={handleShowDetails}>
				{/* Separate focusable element, inaccessible to the mouse.
					It is necessary for handle a focus from the keyboard and ignoring a focus on the mouse click*/}
				<div className={styles.focusable} role='button' tabIndex={0} onKeyDown={handleShowDetailsByKeyboard} />

				{label && <p className={cn(styles.label, !active && styles.inactive)}>{label}</p>}

				<div className={cn(styles.filter, !active && styles.inactive)}>
					{methods.length !== 0 && (
						<span className={cn(styles.labelBox)} style={{backgroundColor: methodLabelColors[methods[0]]}}>
							{methods[0]}
						</span>
					)}
					{methods.length > 1 && (
						<span className={styles.labelMore} title={methods.slice(1).join(', ')}>
							+ {methods.length - 1}
						</span>
					)}

					{resourceTypes.length !== 0 && (
						<span
							className={cn(styles.labelBox)}
							style={{backgroundColor: resourceLabelColors[resourceTypes[0]]}}>
							{resourceTypes[0]}
						</span>
					)}
					{resourceTypes.length > 1 && (
						<span className={styles.labelMore} title={resourceTypes.slice(1).join(', ')}>
							+ {resourceTypes.length - 1}
						</span>
					)}

					<span className={cn(styles.url, !url && styles.placeholder)} title={url && url.toString()}>
						{url || 'Any url'}
					</span>
				</div>

				<p className={styles.actionsSummary}>{active ? actionsSummary || 'No actions' : 'Inactive'}</p>
			</div>

			{!isExportMode && (
				<Dropdown
					ref={dropdownRef}
					className={styles.control}
					render={(dropdownProps) => <IconButton {...dropdownProps} icon={<MoreIcon />} />}
					preferExpansionAlignX='start'
					content={
						<RulesControl
							ruleIsActive={active}
							allowMoveAbove={!isStartEdgePosition && false /* TODO implement the feature */}
							allowMoveBelow={!isEndEdgePosition && false}
							onActiveToggle={handleActiveToggle}
							onMove={handleMove}
							onEdit={handleEdit}
							onRemove={handleRemove}
						/>
					}
				/>
			)}

			{showRemoveAsk && (
				<PopUpConfirm onConfirm={handleRemoveConfirm} onCancel={handleRemoveCancel}>
					Remove the rule forever?
				</PopUpConfirm>
			)}
		</li>
	);
});

RulesItem.displayName = 'RulesItem';
