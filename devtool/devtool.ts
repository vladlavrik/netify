import './components/app/AppScaffold'
// import './components/rules/RulesSection.js'
// import './components/logs/LogsSection.js'
import './components/compose/ComposeSection'

const tpl = document.getElementById('app-template') as HTMLTemplateElement;
const app = tpl.content.cloneNode(true);

document.body.appendChild(app);
