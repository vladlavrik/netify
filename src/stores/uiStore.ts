import {createStore, restore, createEvent} from 'effector';

export const setPanelShown = createEvent<boolean>('set panel shown');
export const setDebuggerEnabled = createEvent<boolean>('set debugger enabled');
export const toggleDebuggerEnabled = createEvent('toggle debugger enabled');
export const setDebuggerActive = createEvent<boolean>('set is debugger active');
export const toggleSecondarySectionCollapse = createEvent('toggle secondary section collapse');
export const showCompose = createEvent('show compose');
export const hideCompose = createEvent('hide compose');
export const showRuleEditor = createEvent<string>('show rule editor');
export const hideRuleEditor = createEvent('hide rule editor');
export const showRuleDetails = createEvent<string>('show rule details');
export const hideRuleDetails = createEvent('hide rule rule details');
export const highlightRule = createEvent<string>('highlight rule'); // TODO remove
export const resetHighlightedRule = createEvent('reset highlighted rule'); // TODO remove

(window as any).showRuleDetails = showRuleDetails; // TODO

/** TODO for future */
export const $panelShown = restore(setPanelShown, true); //

/** Network debugger is enabled ny user, but this does not ensure that it is active, as it may be a list of rules is empty */
export const $debuggerEnabled = restore(setDebuggerEnabled, true);

/** Network debugger started and request listener is active */
export const $debuggerActive = restore(setDebuggerActive, false);

export const $secondarySectionCollapsed = createStore(false);

export const $ruleComposeShown = createStore(false);

export const $ruleEditorShownFor = createStore<null | string>(null);

export const $ruleDetailsShownFor = createStore<null | string>(null); // TODO scroll to row in UI if not intersected

/** Highlighted rule by follow form the logs list */
export const $highlightedRuleId = createStore<null | string>(null); // TODO remove

const setFromInput = <T>(_: any, value: T) => value;
const toggle = (value: boolean) => !value;
const switchOn = () => true;
const switchOff = () => false;
const toNull = () => null;

$debuggerEnabled.on(toggleDebuggerEnabled, toggle);
$secondarySectionCollapsed.on(toggleSecondarySectionCollapse, toggle);
$ruleComposeShown.on(showCompose, switchOn);
$ruleComposeShown.on(hideCompose, switchOff);
$ruleEditorShownFor.on(showRuleEditor, setFromInput);
$ruleEditorShownFor.on(hideRuleEditor, toNull);
$ruleDetailsShownFor.on(showRuleDetails, setFromInput);
$ruleDetailsShownFor.on(hideRuleDetails, toNull);
$highlightedRuleId.on(highlightRule, setFromInput); // TODO remove
$highlightedRuleId.on(resetHighlightedRule, toNull); // TODO remove
