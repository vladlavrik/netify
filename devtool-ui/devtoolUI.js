import './components/app/AppScaffold.js'
import './components/rules/RulesSection.js'
import './components/logs/LogsSection.js'
import './components/compose/ComposeSection.js'


const tpl = document.getElementById('app-template');
const app = tpl.content.cloneNode(true);

document.body.appendChild(app);
