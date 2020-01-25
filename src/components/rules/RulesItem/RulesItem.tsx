import React, {memo, useContext, useState, useRef, useCallback, useMemo, useEffect} from 'react';
import cn from 'classnames';
import {Rule} from '@/interfaces/rule';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {DbContext} from '@/contexts/dbContext';
import {showRuleEditor} from '@/stores/uiStore';
import {removeRule, updateRule, moveRule} from '@/stores/rulesStore';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Dropdown, useDropdownExpansion} from '@/components/@common/misc/Dropdown';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import {stringifyActionsSummary} from './stringifyActionsSummary';
import {RulesControl} from '../RulesControl';
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
	onShowDetails(id: string): void;
}

export const RulesItem = memo<RulesItemProps>(function RulesItem(props) {
	const {data, isStartEdgePosition, isEndEdgePosition, isHighlighted, onShowDetails} = props;
	const {id: ruleId, label, active, filter, action} = data;
	const {url, methods, resourceTypes} = filter;

	const {rulesMapper} = useContext(DbContext)!;

	const [showRemoveAsk, setShowRemoveAsk] = useState(false);

	const rootRef = useRef<HTMLLIElement>(null);

	const actionsSummary = useMemo(() => stringifyActionsSummary(action), [action]);

	const [controlDDExpanded, controlDDActions] = useDropdownExpansion();

	const handleShowDetails = useCallback(() => onShowDetails(ruleId), [ruleId, onShowDetails]);

	const handleShowDetailsByKeyboard = useCallback(
		({key}: React.KeyboardEvent) => {
			if (key === ' ' || key === 'Enter') {
				handleShowDetails();
			}
		},
		[handleShowDetails],
	);

	const handleEdit = useCallback(() => {
		showRuleEditor(ruleId);
		controlDDActions.handleCollapse();
	}, [ruleId]);

	const handleActiveToggle = useCallback(async () => {
		const rule = {...data, active: !data.active};
		await updateRule({rulesMapper, rule});
	}, [data, rulesMapper]);

	const handleMove = useCallback(
		async (offset: number) => {
			await moveRule({rulesMapper, ruleId, offset});
		},
		[ruleId],
	);

	const handleRemove = useCallback(() => {
		setShowRemoveAsk(true);
		controlDDActions.handleCollapse();
	}, []);

	const handleRemoveCancel = useCallback(() => {
		setShowRemoveAsk(false);
	}, []);

	const handleRemoveConfirm = useCallback(async () => {
		await removeRule({rulesMapper, ruleId});
		setShowRemoveAsk(false);
	}, [ruleId, rulesMapper]);

	useEffect(() => {
		if (isHighlighted && rootRef.current) {
			(rootRef.current as any).scrollIntoViewIfNeeded(true);
		}
	}, [isHighlighted]);

	return (
		<li ref={rootRef} className={cn(styles.root, isHighlighted && styles.highlighted)}>
			<div className={styles.entry} role='button' onClick={handleShowDetails}>
				{/* Separate focusable element, inaccessible to the mouse.
					It is necessary for handle a focus from the keyboard and ignoring a focus on the mouse click*/}
				<div className={styles.focusable} role='button' tabIndex={0} onKeyDown={handleShowDetailsByKeyboard} />

				{label && <p className={styles.label}>{label}</p>}

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

			<Dropdown
				className={styles.control}
				expanded={controlDDExpanded}
				target={
					<IconButton className={styles.controlTarget} onClick={controlDDActions.handleExpansionSwitch} />
				}
				preferExpansionAlignX='start'
				onCollapse={controlDDActions.handleCollapse}>
				<RulesControl
					ruleIsActive={active}
					allowMoveAbove={!isStartEdgePosition && false /* TODO implement the feature */}
					allowMoveBelow={!isEndEdgePosition && false}
					onActiveToggle={handleActiveToggle}
					onMove={handleMove}
					onEdit={handleEdit}
					onRemove={handleRemove}
				/>
			</Dropdown>

			{showRemoveAsk && (
				<PopUpConfirm onConfirm={handleRemoveConfirm} onCancel={handleRemoveCancel}>
					Remove the rule forever?
				</PopUpConfirm>
			)}
		</li>
	);
});
