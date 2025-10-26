import React, {useEffect, useMemo, useRef} from 'react';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {Rule} from '@/interfaces/rule';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {Dropdown, DropdownRef} from '@/components/@common/misc/Dropdown';
import {useStores} from '@/stores/useStores';
import {RulesItemControls} from '../RulesItemControls';
import {stringifyActionsSummary} from './stringifyActionsSummary';
import MoreIcon from '@/assets/icons/more.svg';
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
	onSelect(ruleId: string, selected: boolean, range: boolean): void;
}

export const RulesItem = observer<RulesItemProps>((props) => {
	const {data, isStartEdgePosition, isEndEdgePosition, isHighlighted, isExportMode, isSelected, onSelect} = props;
	const {id: ruleId, label, active, filter, action} = data;
	const {url, methods, resourceTypes} = filter;

	const {rulesStore} = useStores();

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

	const handleSelectionClick = (event: React.MouseEvent<HTMLInputElement>) => {
		const selected = event.currentTarget.checked;
		const range = event.shiftKey;
		onSelect(ruleId, selected, range);
	};

	useEffect(() => {
		if (isHighlighted && rootRef.current) {
			(rootRef.current as any).scrollIntoViewIfNeeded(true);
		}
	}, [isHighlighted]);

	return (
		<li ref={rootRef} className={cn(styles.root, isHighlighted && styles.highlighted)}>
			{isExportMode && (
				<Checkbox
					className={styles.selectCheckbox}
					checked={isSelected}
					readOnly
					onClick={handleSelectionClick}
				/>
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
					render={(dropdownProps, {expanded}) => (
						<IconButton {...dropdownProps} icon={<MoreIcon />} active={expanded} />
					)}
					preferExpansionAlign='left'
					content={({collapse}) => (
						<RulesItemControls
							ruleId={ruleId}
							ruleIsActive={active}
							allowMoveAbove={!isStartEdgePosition}
							allowMoveBelow={!isEndEdgePosition}
							onClose={collapse}
						/>
					)}
				/>
			)}
		</li>
	);
});

RulesItem.displayName = 'RulesItem';
